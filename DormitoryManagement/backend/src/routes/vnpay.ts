import express, { type Request, type Response } from 'express';
import { ProductCode, HashAlgorithm } from '../vnpay/enums';
import type { ReturnQueryFromVNPay, VerifyReturnUrl } from '../vnpay/types';
import { consoleLogger, ignoreLogger } from '../vnpay/utils';
import { VNPay } from '../vnpay/vnpay';
import { Decimal } from '@prisma/client/runtime/library';
import {
    InpOrderAlreadyConfirmed,
    IpnFailChecksum,
    IpnInvalidAmount,
    IpnOrderNotFound,
    IpnSuccess,
    IpnUnknownError,
} from '../vnpay/constants';
import prisma from '../lib/prisma';
import { InvoiceStatus, Prisma } from '@prisma/client';

const router = express.Router();

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE ?? '2QXUI4B4',
    secureSecret: process.env.VNPAY_SECURE_SECRET ?? 'secret',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    loggerFn: ignoreLogger,
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});

// Tạo payment url
router.post('/payment-url', async (req: Request, res: Response) => {
    try {
        const { invoice_id } = req.body;

        // Kiểm tra invoice_id có tồn tại
        if (!invoice_id) {
            return res.status(400).json({
                success: false,
                message: 'Invoice ID is required'
            });
        }

        // Lấy thông tin hóa đơn từ database
        const invoice = await prisma.invoice.findUnique({
            where: { id: Number(invoice_id) }
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        if (invoice.status === InvoiceStatus.PAID) {
            return res.status(400).json({
                success: false,
                message: 'Invoice already paid'
            });
        }        // Determine studentProfileId: from invoice or from authenticated user
        let studentId = invoice.studentProfileId;

        // Fallback 1: if invoice has no studentId, try get from req.user.profileId
        if (!studentId && 'user' in req && req.user && typeof req.user === 'object') {
            // Existing profileId field from frontend
            if ('profileId' in req.user) {
                console.log('Found profileId in req.user:', (req.user as any).profileId);
                studentId = Number((req.user as any).profileId);
            }
        }

        // Fallback 2: fetch studentProfile by userId in JWT token
        if (!studentId && 'user' in req && req.user && typeof req.user === 'object') {
            const userId = (req.user as any).id;
            if (userId) {
                const profile = await prisma.studentProfile.findUnique({ where: { userId } });
                if (profile) {
                    console.log('Found studentProfile by userId:', profile.id);
                    studentId = profile.id;
                }
            }
        }

        // Fallback 3: if this is a room invoice, find a student in the room to be the payer
        if (!studentId && invoice.roomId) {
            const roomStudents = await prisma.studentProfile.findMany({
                where: { roomId: invoice.roomId },
                take: 1
            });

            if (roomStudents.length > 0) {
                console.log('Found student in room to be payer:', roomStudents[0].id);
                studentId = roomStudents[0].id;
            }
        }

        // Fallback 4: Look for direct association from Invoice to Room to Student
        if (!studentId && invoice.roomId) {
            console.log('Attempting to find room and associated students');
            const room = await prisma.room.findUnique({
                where: { id: invoice.roomId },
                include: {
                    residents: {
                        select: { id: true },
                        take: 1
                    }
                }
            });

            if (room && room.residents && room.residents.length > 0) {
                console.log('Found student through room association:', room.residents[0].id);
                studentId = room.residents[0].id;
            }
        }

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xác định sinh viên cho hóa đơn này. Vui lòng liên hệ quản trị viên.'
            });
        }

        // Tạo một bản ghi payment với status = 'pending'
        const payment = await prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                studentProfileId: studentId,
                amount: invoice.totalAmount,
                paymentMethod: 'vnpay',
                transactionCode: '',
                paymentDate: new Date()
            }
        });

        // Tạo mã giao dịch duy nhất kết hợp payment_id
        const txnRef = `INV${invoice.id}_PAY${payment.id}_${Date.now()}`;

        // Cập nhật transaction_id trong payment
        await prisma.payment.update({
            where: { id: payment.id },
            data: { transactionCode: txnRef }
        });        // Debug số tiền
        console.log('Invoice amount before conversion:', invoice.totalAmount);
        // Chuyển đổi số tiền và kiểm tra tính hợp lệ
        // Convert totalAmount (Decimal) to number
        let amountValue: number;
        if (invoice.totalAmount instanceof Decimal) {
            amountValue = invoice.totalAmount.toNumber();
        } else {
            // Fallback parse string/number
            const amountStr = String(invoice.totalAmount);
            amountValue = parseFloat(amountStr.replace(/,/g, ''));
        }

        console.log('Amount after parsing:', amountValue);
        // Đảm bảo số tiền là số nguyên - VNPay quy định
        // Xử lý đặc biệt để loại bỏ phần thập phân và đảm bảo không có vấn đề với VNPay
        const integerAmount = Math.floor(amountValue); // Lấy phần nguyên
        const vnpAmount = integerAmount; // VNPay expects amount in VND without extra multiplier // VNPay yêu cầu số tiền * 100

        // Kiểm tra tính hợp lệ của số tiền
        if (isNaN(vnpAmount) || vnpAmount <= 0) {
            console.error('Invalid VNPay amount after conversion:', vnpAmount);
            return res.status(400).json({
                success: false,
                message: 'Số tiền không hợp lệ cho thanh toán VNPay'
            });
        }

        console.log('Amount being sent to VNPay:', vnpAmount);

        // Tạo URL thanh toán
        const urlString = vnpay.buildPaymentUrl(
            {
                vnp_Amount: vnpAmount, // VNPay yêu cầu số nguyên đơn vị đồng
                vnp_IpAddr: req.ip || '127.0.0.1',
                vnp_TxnRef: txnRef,
                vnp_OrderInfo: `Thanh toan hoa don #${invoice.id}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `${process.env.VNPAY_RETURN_URL ?? 'http://localhost:8000/api/vnpay/return'}`,
            },
            {
                logger: {
                    type: 'all', // Thay đổi từ 'pick' sang 'all' để log nhiều thông tin hơn
                    loggerFn: (data) => {
                        console.log('VNPay payload:', data);
                        return consoleLogger(data);
                    },
                },
            },
        );

        return res.json({
            success: true,
            paymentUrl: urlString,
            payment_id: payment.id,
            transaction_id: txnRef
        });
    } catch (error) {
        console.error('Error creating payment URL:', error);

        // Cung cấp thông tin lỗi chi tiết hơn để debug
        let errorMessage = 'Không thể tạo URL thanh toán';

        if (error instanceof Error) {
            errorMessage = error.message;
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            errorDetail: process.env.NODE_ENV === 'production' ? undefined : String(error)
        });
    }
});

// Xử lý IPN từ VNPay
router.get('/ipn', async (req: Request<unknown, unknown, unknown, ReturnQueryFromVNPay>, res: Response) => {
    try {
        const verify: VerifyReturnUrl = vnpay.verifyIpnCall(
            { ...req.query },
            {
                logger: {
                    type: 'all',
                    loggerFn: consoleLogger,
                },
            },
        );

        if (!verify.isVerified) {
            console.error('IPN verification failed:', verify.message);
            return res.json(IpnFailChecksum);
        }

        // Phân tích mã giao dịch để lấy payment_id
        const txnRef = verify.vnp_TxnRef;
        const paymentIdMatch = txnRef.match(/PAY(\d+)_/);

        if (!paymentIdMatch) {
            console.error('Invalid transaction reference format:', txnRef);
            return res.json(IpnOrderNotFound);
        }

        const paymentId = parseInt(paymentIdMatch[1]);

        // Tìm payment trong database
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { invoice: true }
        });

        if (!payment) {
            console.error('Payment not found:', paymentId);
            return res.json(IpnOrderNotFound);
        }        // Xử lý số tiền đúng cách cho việc kiểm tra
        // Convert payment.amount (Decimal) to number
        let paymentAmountNumber: number;
        if (payment.amount instanceof Decimal) {
            paymentAmountNumber = payment.amount.toNumber();
        } else {
            // Fallback parse string/number
            const amountStr = String(payment.amount);
            paymentAmountNumber = parseFloat(amountStr.replace(/,/g, ''));
        }

        const integerAmount = Math.floor(paymentAmountNumber);
        const expectedAmount = integerAmount * 100;

        // Convert received amount from VNPay to number
        const receivedAmount = typeof verify.vnp_Amount === 'string'
            ? parseInt(verify.vnp_Amount.replace(/,/g, ''), 10)
            : verify.vnp_Amount;

        console.log('IPN Amount check:', {
            paymentAmount: payment.amount,
            paymentAmountNumber,
            expectedAmount,
            receivedAmount
        });

        if (Math.abs(receivedAmount - expectedAmount) > 1) {
            console.error(`Amount mismatch: expected ${expectedAmount}, got ${receivedAmount}`);
            return res.json(IpnInvalidAmount);
        }
        // Cập nhật trạng thái payment
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                transactionCode: verify.vnp_TransactionNo?.toString() || txnRef
            }
        });

        // Cập nhật trạng thái invoice
        if (verify.vnp_ResponseCode === '00') {
            // Thanh toán thành công
            await prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: {
                    status: InvoiceStatus.PAID,
                    paidAmount: {
                        increment: payment.amount
                    }
                }
            });
        }

        console.log('Payment processed successfully:', paymentId);
        return res.json(IpnSuccess);
    } catch (error) {
        console.error(`IPN error: ${error}`);
        return res.json(IpnUnknownError);
    }
});

// Xử lý return url (redirect sau thanh toán)
router.get('/return', (req: Request<unknown, unknown, unknown, ReturnQueryFromVNPay>, res: Response) => {
    let verify: VerifyReturnUrl;
    try {
        verify = vnpay.verifyReturnUrl(
            { ...req.query },
            {
                logger: {
                    type: 'pick',
                    fields: ['createdAt', 'method', 'isVerified', 'message'],
                    loggerFn: (data) => console.log(data),
                },
            },
        );

        // Lấy payment_id từ txnRef
        const txnRef = req.query.vnp_TxnRef || '';
        const paymentIdMatch = txnRef.toString().match(/PAY(\d+)_/);
        const paymentId = paymentIdMatch ? paymentIdMatch[1] : null;

        // Redirect to our frontend PaymentResult page
        let redirectUrl = process.env.FRONTEND_PAYMENT_RESULT_URL || '/payments/result';        // Thêm query params vào URL redirect
        redirectUrl += `?status=${verify.isSuccess ? 'success' : 'failed'}`;

        if (paymentId) {
            redirectUrl += `&paymentId=${paymentId}`;
        }

        if (verify.vnp_ResponseCode) {
            redirectUrl += `&responseCode=${verify.vnp_ResponseCode}`;

            // Thêm mã lỗi rõ ràng hơn nếu có lỗi
            if (verify.vnp_ResponseCode !== '00') {
                console.log(`VNPay Error: Response code ${verify.vnp_ResponseCode}`);

                // Xử lý các mã lỗi phổ biến
                if (verify.vnp_ResponseCode === '72') {
                    redirectUrl += '&errorMessage=So_tien_khong_hop_le';
                } else if (verify.vnp_ResponseCode === '07') {
                    redirectUrl += '&errorMessage=Giao_dich_bi_nghi_ngo_gian_lan';
                } else if (verify.vnp_ResponseCode === '09') {
                    redirectUrl += '&errorMessage=The_hoac_TK_bi_khoa';
                } else if (verify.vnp_ResponseCode === '11') {
                    redirectUrl += '&errorMessage=Giao_dich_da_het_han';
                } else if (verify.vnp_ResponseCode === '12') {
                    redirectUrl += '&errorMessage=Giao_dich_bi_huy';
                } else if (verify.vnp_ResponseCode === '24') {
                    redirectUrl += '&errorMessage=Khach_hang_huy_giao_dich';
                } else {
                    redirectUrl += '&errorMessage=Loi_thanh_toan';
                }
            }
        }

        // Chuyển hướng người dùng về frontend với kết quả thanh toán
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error(`Return URL error: ${error}`);
        const redirectUrl = `${process.env.FRONTEND_PAYMENT_RESULT_URL || '/payments/result'}?status=error`;
        return res.redirect(redirectUrl);
    }
});

// API lấy thông tin thanh toán
router.get('/payment/:id', async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);

        if (isNaN(paymentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment ID'
            });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                invoice: true,
                studentProfile: {
                    select: {
                        fullName: true,
                        studentId: true
                    }
                }
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Lấy chi tiết invoice
        const invoice = await prisma.invoice.findUnique({
            where: { id: payment.invoiceId }
        });

        return res.json({
            success: true,
            payment: {
                id: payment.id,
                invoiceId: payment.invoiceId,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                transactionCode: payment.transactionCode,
                paymentDate: payment.paymentDate,
                studentProfile: payment.studentProfile,
                invoice: invoice ? {
                    id: invoice.id,
                    totalAmount: invoice.totalAmount,
                    status: invoice.status
                } : null
            }
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details'
        });
    }
});

// API lấy danh sách thanh toán theo sinh viên
router.get('/payments/student/:studentId', async (req: Request, res: Response) => {
    try {
        const studentProfileId = parseInt(req.params.studentId);

        if (isNaN(studentProfileId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID'
            });
        }

        const invoices = await prisma.invoice.findMany({
            where: {
                studentProfileId: studentProfileId
            },
            include: {
                payments: true
            }
        });

        return res.json({
            success: true,
            invoices: invoices.map(invoice => ({
                id: invoice.id,
                totalAmount: invoice.totalAmount,
                paidAmount: invoice.paidAmount,
                status: invoice.status,
                dueDate: invoice.dueDate,
                billingMonth: invoice.billingMonth,
                billingYear: invoice.billingYear,
                payments: invoice.payments.map(payment => ({
                    id: payment.id,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod,
                    transactionCode: payment.transactionCode,
                    paymentDate: payment.paymentDate
                }))
            }))
        });
    } catch (error) {
        console.error('Error fetching student payments:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch student payments'
        });
    }
});

export default router;
