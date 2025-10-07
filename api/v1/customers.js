const express = require("express");
const router = express.Router();

const pool = require("../database/database");

router.get("/customers", async (req, res) => {
  try {
    const query = await pool.query(`
            SELECT * FROM customers;
            `);

    res.status(200).json({
      code: 200,
      status: "Success",
      customers: query.rows,
    });
  } catch (error) {
    console.log("error in GET /v1/customers", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.get('/customers/:id', async(req, res) => {
    try {
        const { id } = req.params;
            const query = await pool.query(
              `SELECT * FROM customers WHERE customer_id = $1`,
              [id]
            );

        if(query.rows.length === 0){
            return res.status(404).json({
                code: 404,
                status: 'Not Found',
                message: 'Customer not found try again...'
            })
        }

        res.status(200).json({
              code: 200,
              status: "Success",
              customers: query.rows[0]
            });
          } catch (error) {
            console.error("error in GET /v1/customers/:id", error);
            res.status(500).json({
              code: 500,
              status: "Internal Server Error",
              message: "Server error, try again later..."
            });
    }
})

router.post("/customers/new", async (req, res) => {
  try {
    const { name, email } = req.body;

        if (!name || !email) {
          return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Missing required fields: name, email"
          });
        }

    const query = `
    INSERT INTO customers (customer_name)
    VALUES ($1) RETURNING *;
  `;
    const values = [name, email];
    const result = await pool.query(query, values);

    res.status(201).json({
      code: 201,
      status: "Created",
      customers: result.rows[0],
    });
  } catch (error) {
    console.log("error in POST /v1/customers/new", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const query = `
      UPDATE customers 
      SET customer_name = COALESCE($1, customer_name),
    email = COALESCE($2, email)
      WHERE customer_id = $3
      RETURNING *;
    `;
    const values = [name, email, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Customer not found"
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      customers: result.rows[0]
    });
  } catch (error) {
    console.error("error in PUT /v1/customers/:id", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error, try again later..."
    });
  }
});

router.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM customers WHERE customer_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Customer not found"
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Customer deleted successfully",
      customers: result.rows[0]
    });
  } catch (error) {
    console.error("error in DELETE /v1/customers/:id", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error, try again later..."
    });
  }
});

module.exports = router;
