const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET: Lấy danh sách users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dorm.users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET: Lấy thông tin user cụ thể
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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

// DELETE: Xóa user khỏi database
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM dorm.users WHERE id = $1 RETURNING *`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
 