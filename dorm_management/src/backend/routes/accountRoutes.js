const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET: Lấy danh sách tài khoản
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        s.id,
        s.code,
        s.firstname,
        s.middlename,
        s.lastname,
        s.department,
        s.course,
        s.gender,
        s.contact,
        s.email,
        s.address,
        d.name AS dorm,
        r.name AS room,
        r.price,
        CASE 
            WHEN a.status = 1 THEN 'Active'
            ELSE 'Inactive'
        END AS status,
        a.date_created
      FROM
        dorm.student_list s
      JOIN
        dorm.account_list a ON s.id = a.student_id
      JOIN
        dorm.room_list r ON a.room_id = r.id
      JOIN
        dorm.dorm_list d ON r.dorm_id = d.id
      WHERE
        s.delete_flag = 0 AND a.delete_flag = 0 AND r.delete_flag = 0 AND d.delete_flag = 0;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
