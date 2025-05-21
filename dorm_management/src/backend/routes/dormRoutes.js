const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET: Lấy danh sách ký túc xá
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dorm.dorm_list WHERE delete_flag = 0"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching dorms:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT: Cập nhật thông tin ký túc xá
router.put("/:id", async (req, res) => {
  const dormId = req.params.id;
  const { name, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE dorm.dorm_list 
       SET name = $1, status = $2
       WHERE id = $3 AND delete_flag = 0
       RETURNING *`,
      [name, status, dormId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Dorm not found or already deleted");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating dorm:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE: Xóa ký túc xá khỏi database
router.delete("/:id", async (req, res) => {
  const dormId = req.params.id;

  try {
    // Xóa các phòng trong ký túc xá trước
    await pool.query(`DELETE FROM dorm.room_list WHERE dorm_id = $1`, [dormId]);

    // Sau đó xóa ký túc xá
    const result = await pool.query(
      `DELETE FROM dorm.dorm_list WHERE id = $1 RETURNING *`,
      [dormId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Dorm not found");
    }

    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    console.error("Error deleting dorm:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
