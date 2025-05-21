const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

// Import routes
const studentRoutes = require("./routes/studentRoutes");
const dormRoutes = require("./routes/dormRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const port = 5000;

// Kết nối PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "hostel1234",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/students", studentRoutes);
app.use("/dorms", dormRoutes);
app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);
app.use("/accounts", accountRoutes);
app.use("/dashboard", dashboardRoutes);

// GET: Lấy danh sách sinh viên
app.get("/students", async (req, res) => {
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

// GET: Lấy danh sách ký túc xá (dorm_list)
app.get("/dorms", async (req, res) => {
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

// GET: Lấy danh sách phòng ký túc xá (listofroom)
app.get("/rooms", async (req, res) => {
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
GROUP BY rl.id, dl.name, rl.name, rl.slots, rl.price, rl.date_created, rl.status;

    `
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET: Lấy danh sách tài khoản (account)
app.get("/accounts", async (req, res) => {
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

// POST: Thêm sinh viên mới
app.post("/students", async (req, res) => {
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

// GET: Lấy thông tin user cụ thể
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM dorm.users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// PUT: Update user information
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { firstname, middlename, lastname, username, password, type } =
    req.body;

  console.log("Update user request:", {
    userId,
    body: req.body,
  });

  try {
    // First check if user exists
    const checkUser = await pool.query(
      "SELECT * FROM dorm.users WHERE id = $1",
      [userId]
    );

    if (checkUser.rows.length === 0) {
      console.log("User not found:", userId);
      return res.status(404).send("User not found");
    }

    // If password is not provided, keep the existing password
    let updateQuery;
    let queryParams;

    if (!password) {
      updateQuery = `
        UPDATE dorm.users 
        SET firstname = $1, middlename = $2, lastname = $3, 
            username = $4, type = $5,
            date_updated = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`;
      queryParams = [
        firstname,
        middlename || null,
        lastname,
        username,
        type,
        userId,
      ];
    } else {
      updateQuery = `
        UPDATE dorm.users 
        SET firstname = $1, middlename = $2, lastname = $3, 
            username = $4, password = $5, type = $6,
            date_updated = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *`;
      queryParams = [
        firstname,
        middlename || null,
        lastname,
        username,
        password,
        type,
        userId,
      ];
    }

    console.log("Executing query:", updateQuery);
    console.log("With params:", queryParams);

    const result = await pool.query(updateQuery, queryParams);

    console.log("Update result:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", {
      message: error.message,
      detail: error.detail,
      code: error.code,
      stack: error.stack,
    });
    res.status(500).send(error.message || "Internal Server Error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dorm.users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT: Cập nhật thông tin sinh viên theo ID
app.put("/students/:id", async (req, res) => {
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
    // Cập nhật thông tin sinh viên trong cơ sở dữ liệu
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
        studentId, // Tham số ID sinh viên
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

// PUT: Cập nhật thông tin ký túc xá
app.put("/dorms/:id", async (req, res) => {
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

// PUT: Cập nhật thông tin phòng
app.put("/rooms/:id", async (req, res) => {
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

// GET: Lấy lịch sử thanh toán theo account_id
app.get("/api/payment/history/:accountId", async (req, res) => {
  const { accountId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, account_id, month_of, amount, date_created, date_updated
       FROM dorm.payment_list
       WHERE account_id = $1
       ORDER BY date_created DESC`,
      [accountId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).send("Internal Server Error");
  }
});
