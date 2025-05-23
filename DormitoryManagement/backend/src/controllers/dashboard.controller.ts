import { Request, Response, NextFunction } from 'express'; // Thêm NextFunction
import { PrismaClient } from '@prisma/client';
import { DashboardService } from '../services/dashboard.service';

// Lưu ý: Nên sử dụng một instance PrismaClient duy nhất (singleton)
// được khởi tạo ở một file khác (vd: src/utils/prisma.ts) và import vào đây.
const prisma = new PrismaClient();
const dashboardService = new DashboardService();

export class DashboardController {
  // Lấy các số liệu thống kê tổng quan
  async getStats(req: Request, res: Response, next: NextFunction) { // Thêm next
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      let buildingId: number | null = null;

      // Nếu là STAFF, lấy buildingId dựa trên email
      if (role === 'STAFF' && userId) {
        const email = req.user?.email;
        if (email) {
          buildingId = email === 'staff.b3@example.com' ? 1 : 
                       email === 'staff.b9@example.com' ? 2 : null;
        }
      }

      // Sử dụng service để lấy dữ liệu thống kê
      const stats = await dashboardService.getStats();

      // Lấy thêm thông tin về số phòng trống
      const availableRooms = await prisma.room.count({
        where: {
          status: 'AVAILABLE',
          ...(buildingId ? { buildingId } : {})
        }
      });

      // Lấy thông tin về số lượng sinh viên
      const totalStudents = buildingId ? await prisma.studentProfile.count({
        where: {
          OR: [
            // Sinh viên hiện tại đang ở trong tòa nhà
            {
              room: {
                buildingId: {
                  equals: buildingId
                }
              }
            },
            // Sinh viên đã từng sống trong tòa nhà
            {
              room: {
                buildingId: {
                  equals: buildingId
                }
              }
            }
          ]
        }
      }) : await prisma.studentProfile.count();

      // Lấy thông tin về hóa đơn chưa thanh toán
      const unpaidInvoices = buildingId ? await prisma.invoice.count({
        where: {
          status: 'UNPAID',
          OR: [
            // Hóa đơn của các sinh viên hiện tại đang ở trong tòa nhà
            {
              room: {
                buildingId: {
                  equals: buildingId
                }
              }
            },
            // Hóa đơn của các sinh viên đã từng sống trong tòa nhà
            {
              studentProfile: {
                room: {
                  buildingId: {
                    equals: buildingId
                  }
                }
              }
            }
          ]
        }
      }) : await prisma.invoice.count({
        where: {
          status: 'UNPAID'
        }
      });

      // Lấy thông tin về số lượng yêu cầu bảo trì đang chờ xử lý
      const pendingMaintenance = buildingId ? await prisma.maintenance.count({
        where: {
          status: 'PENDING',
          room: {
            buildingId: {
              equals: buildingId
            }
          }
        }
      }) : await prisma.maintenance.count({
        where: {
          status: 'PENDING'
        }
      });

      res.status(200).json({ // Thêm status code và chuẩn hóa response
        status: 'success',
        data: {
          ...stats,
          availableRooms,
          unpaidInvoices,
          totalStudents,
          pendingMaintenance
        }
      });
    } catch (error) {
      // Chuyển lỗi cho global error handler
      next(error);
    }
  }

  // Lấy thống kê sinh viên theo giới tính
  async getStudentsByGender(_req: Request, res: Response, next: NextFunction) { // Đổi tên hàm, thêm next
    try {
      // Đổi prisma.resident thành prisma.studentProfile
      const stats = await prisma.studentProfile.groupBy({
        by: ['gender'],
        _count: {
          gender: true // Đếm theo field gender
        },
      });

      // Định dạng lại kết quả cho dễ hiểu hơn (tùy chọn)
      const formattedStats = stats.map(item => ({
        gender: item.gender,
        count: item._count.gender
      }));

      res.status(200).json({ // Thêm status code và chuẩn hóa response
        status: 'success',
        data: formattedStats
      });
    } catch (error) {
      // Chuyển lỗi cho global error handler
      next(error);
    }
  }

  // Lấy tình trạng sử dụng phòng
  async getRoomsOccupancy(_req: Request, res: Response, next: NextFunction) { // Thêm next
    try {
      // Lấy thông tin phòng bao gồm cả actualOccupancy
      const rooms = await prisma.room.findMany({
        select: { // Chỉ chọn các trường cần thiết
          id: true,
          number: true,
          capacity: true,
          actualOccupancy: true, // Sử dụng trường này thay vì _count
          status: true,
          building: { // Lấy thêm tên tòa nhà
            select: {
              name: true
            }
          }
        },
        orderBy: [
          { building: { name: 'asc' } },
          { number: 'asc' }
        ]
      });

      // Có thể map lại nếu cần định dạng khác, nhưng trả về trực tiếp cũng ổn
      // const occupancy = rooms.map(room => ({
      //   id: room.id,
      //   buildingName: room.building.name,
      //   number: room.number,
      //   capacity: room.capacity,
      //   occupied: room.actualOccupancy, // Sử dụng actualOccupancy
      //   status: room.status
      // }));

      res.status(200).json({ // Thêm status code và chuẩn hóa response
        status: 'success',
        results: rooms.length,
        data: rooms // Trả về trực tiếp danh sách phòng với thông tin occupancy
      });
    } catch (error) {
      // Chuyển lỗi cho global error handler
      next(error);
    }
  }

  // Lấy các hoạt động gần đây (ví dụ: sinh viên mới được tạo)
  async getRecentActivities(_req: Request, res: Response, next: NextFunction) { // Thêm next
    try {
      // Đổi prisma.resident thành prisma.studentProfile
      // Đổi select name thành fullName
      const recentStudents = await prisma.studentProfile.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true, // Đổi từ name
          createdAt: true,
          updatedAt: true,
          user: { // Lấy thêm email nếu cần
            select: { email: true }
          }
        }
      });

      res.status(200).json({ // Thêm status code và chuẩn hóa response
        status: 'success',
        results: recentStudents.length,
        data: recentStudents
      });
    } catch (error) {
      // Chuyển lỗi cho global error handler
      next(error);
    }
  }
}