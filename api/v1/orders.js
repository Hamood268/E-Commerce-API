const express = require("express");
const router = express.Router();

const pool = require("../database/database");

router.get("/orders", async (req, res) => {
  try {
    const query = await pool.query(`
            SELECT * FROM orders;
            `);

    res.status(200).json({
      code: 200,
      status: "Success",
      orders: query.rows,
    });
  } catch (error) {
    console.log("error in GET /v1/orders", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.get('/orders/:id', async(req, res) => {
    try {
        const { id } = req.params;
            const query = await pool.query(
              `SELECT * FROM orders WHERE orders_id = $1`,
              [id]
            );

        if(query.rows.length === 0){
            return res.status(404).json({
                code: 404,
                status: 'Not Found',
                message: 'Order not found try again...'
            })
        }

        res.status(200).json({
              code: 200,
              status: "Success",
              orders: query.rows[0]
            });
          } catch (error) {
            console.error("error in GET /v1/orders/:id", error);
            res.status(500).json({
              code: 500,
              status: "Internal Server Error",
              message: "Server error, try again later..."
            });
    }
})

router.post("/orders/new", async (req, res) => {
  try {
    const { name } = req.body;

        if (!name ) {
          return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Missing required fields: name"
          });
        }

    const query = `
    INSERT INTO orders (orders_name)
    VALUES ($1) RETURNING *;
  `;
    const values = [name];
    const result = await pool.query(query, values);

    res.status(201).json({
      code: 201,
      status: "Created",
      orders: result.rows[0],
    });
  } catch (error) {
    console.log("error in POST /v1/orders/new", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM orders WHERE orders_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Order not found"
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Order deleted successfully",
      orders: result.rows[0]
    });
  } catch (error) {
    console.error("error in DELETE /v1/orders/:id", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error, try again later..."
    });
  }
});

module.exports = router;
