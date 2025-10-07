const express = require("express");
const router = express.Router();

const pool = require("../database/database");

router.get("/products", async (req, res) => {
  try {
    const query = await pool.query(`
            SELECT * FROM products;
            `);

    res.status(200).json({
      code: 200,
      status: "Success",
      products: query.rows,
    });
  } catch (error) {
    console.log("error in GET /v1/products", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.get('/products/:id', async(req, res) => {
    try {
        const { id } = req.params;
            const query = await pool.query(
              `SELECT * FROM products WHERE product_id = $1`,
              [id]
            );

        if(query.rows.length === 0){
            return res.status(404).json({
                code: 404,
                status: 'Not Found',
                message: 'Product not found try again...'
            })
        }

        res.status(200).json({
              code: 200,
              status: "Success",
              product: query.rows[0]
            });
          } catch (error) {
            console.error("error in GET /v1/products/:id", error);
            res.status(500).json({
              code: 500,
              status: "Internal Server Error",
              message: "Server error, try again later..."
            });
    }
})

router.post("/products/new", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

        if (!name || price === undefined || stock === undefined) {
          return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Missing required fields: name, price, stock"
          });
        }
    
        if (typeof price !== 'number' || typeof stock !== 'number') {
          return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Price and stock must be numbers"
          });
        }
    
        if (price < 0 || stock < 0) {
          return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Price and stock cannot be negative"
          });
        }

    const query = `
    INSERT INTO products (product_name, description, price, stock)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
    const values = [name, description, price, stock];
    const result = await pool.query(query, values);

    res.status(201).json({
      code: 201,
      status: "Created",
      products: result.rows[0],
    });
  } catch (error) {
    console.log("error in POST /v1/products/new", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error try again later...",
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM products WHERE product_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Product not found"
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Product deleted successfully",
      product: result.rows[0]
    });
  } catch (error) {
    console.error("error in DELETE /v1/products/:id", error);
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: "Server error, try again later..."
    });
  }
});

module.exports = router;