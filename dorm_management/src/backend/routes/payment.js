const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Lấy lịch sử thanh toán theo accountId
router.get("/history/:accountId", async (req, res) => {
  const { accountId } = req.params;
  try {
    const payments = await prisma.paymentList.findMany({
      where: { accountId: Number(accountId) },
      orderBy: { dateCreated: "desc" },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy lịch sử thanh toán" });
  }
});

module.exports = router;
