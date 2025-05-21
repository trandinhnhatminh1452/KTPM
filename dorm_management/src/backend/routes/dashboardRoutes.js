const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Đếm số lượng ký túc xá
router.get("/count/dorms", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM dorm.dorm_list WHERE delete_flag = 0"
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    res.status(500).json({ error: "Failed to count dorms" });
  }
});

// Đếm số lượng phòng
router.get("/count/rooms", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM dorm.room_list WHERE delete_flag = 0"
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    res.status(500).json({ error: "Failed to count rooms" });
  }
});

// Đếm số lượng sinh viên
router.get("/count/students", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM dorm.student_list WHERE delete_flag = 0"
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    res.status(500).json({ error: "Failed to count students" });
  }
});

module.exports = router;
