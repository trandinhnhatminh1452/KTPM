const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET: Lấy danh sách sinh viên
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dorm.student_list WHERE delete_flag = 0"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST: Thêm sinh viên mới
router.post("/", async (req, res) => {
  const {
    code,
    firstname,
    middlename,
    lastname,
    department,
    course,
    gender,
    contact,
    email,
    address,
    emergency_name,
    emergency_contact,
    emergency_address,
    emergency_relation,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO dorm.student_list 
      (code, firstname, middlename, lastname, department, course, gender, contact, email, address, emergency_name, emergency_contact, emergency_address, emergency_relation) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) 
      RETURNING *`,
      [
        code,
        firstname,
        middlename || null,
        lastname,
        department,
        course,
        gender,
        contact,
        email,
        address,
        emergency_name,
        emergency_contact,
        emergency_address,
        emergency_relation,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting student:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT: Cập nhật thông tin sinh viên theo ID
router.put("/:id", async (req, res) => {
  const studentId = req.params.id;
  const {
    code,
    firstname,
    middlename,
    lastname,
    department,
    course,
    gender,
    contact,
    email,
    address,
    emergency_name,
    emergency_contact,
    emergency_address,
    emergency_relation,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE dorm.student_list 
      SET code = $1, firstname = $2, middlename = $3, lastname = $4, department = $5, course = $6, gender = $7, 
          contact = $8, email = $9, address = $10, emergency_name = $11, emergency_contact = $12, 
          emergency_address = $13, emergency_relation = $14
      WHERE id = $15 AND delete_flag = 0
      RETURNING *`,
      [
        code,
        firstname,
        middlename || null,
        lastname,
        department,
        course,
        gender,
        contact,
        email,
        address,
        emergency_name,
        emergency_contact,
        emergency_address,
        emergency_relation,
        studentId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Student not found or already deleted");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE: Xóa sinh viên khỏi database
router.delete("/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    // Xóa account trước (nếu có)
    await pool.query(`DELETE FROM dorm.account_list WHERE student_id = $1`, [
      studentId,
    ]);

    // Sau đó xóa sinh viên
    const result = await pool.query(
      `DELETE FROM dorm.student_list WHERE id = $1 RETURNING *`,
      [studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Student not found");
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
