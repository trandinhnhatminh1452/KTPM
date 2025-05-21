const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET: Lấy danh sách phòng ký túc xá
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        rl.id AS room_id,
        dl.name AS dorm,
        rl.name AS room,
        rl.slots AS slot,
        (rl.slots - COUNT(al.id)) AS available,
        rl.price,
        rl.date_created,
        rl.status
      FROM dorm.room_list rl
      JOIN dorm.dorm_list dl ON rl.dorm_id = dl.id
      LEFT JOIN dorm.account_list al ON al.room_id = rl.id AND al.delete_flag = 0
      WHERE rl.delete_flag = 0 AND dl.delete_flag = 0
      GROUP BY rl.id, dl.name, rl.name, rl.slots, rl.price, rl.date_created, rl.status;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT: Cập nhật thông tin phòng
router.put("/:id", async (req, res) => {
  const roomId = req.params.id;
  const { dorm, room, slot, available, price, status } = req.body;

  try {
    // Lấy dorm_id từ tên ký túc xá
    const dormResult = await pool.query(
      "SELECT id FROM dorm.dorm_list WHERE name = $1 AND delete_flag = 0",
      [dorm]
    );

    if (dormResult.rows.length === 0) {
      return res.status(404).send("Dorm not found");
    }

    const dormId = dormResult.rows[0].id;

    // Cập nhật thông tin phòng
    const result = await pool.query(
      `UPDATE dorm.room_list 
       SET name = $1, dorm_id = $2, slots = $3, price = $4, status = $5
       WHERE id = $6 AND delete_flag = 0
       RETURNING *`,
      [room, dormId, slot, price, status, roomId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Room not found or already deleted");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE: Xóa phòng khỏi database
router.delete("/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    // Xóa account liên quan đến phòng trước
    await pool.query(`DELETE FROM dorm.account_list WHERE room_id = $1`, [
      roomId,
    ]);

    // Sau đó xóa phòng
    const result = await pool.query(
      `DELETE FROM dorm.room_list WHERE id = $1 RETURNING *`,
      [roomId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Room not found");
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
