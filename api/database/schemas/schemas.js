const pool = require('../database.js');

async function initDB() {
  const products = `
    CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    stock INT DEFAULT 0,
    available_at TIMESTAMP DEFAULT NOW()
    );
    `;

  const customers = `
    CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email TEXT NOT NULL
    );
    `;

  const orders = `
    CREATE TABLE IF NOT EXISTS orders (
    orders_id SERIAL PRIMARY KEY,
    orders_name VARCHAR(100) NOT NULL
    );
    `;

  try {
    await pool.query(products);
    console.log("Products table ready");

    await pool.query(customers);
    console.log("Customers table ready");

    await pool.query(orders);
    console.log("Orders table ready");

  } catch (err) {
    console.error("Error initializing DB", err);
  }
}

async function insertInto() {
  try {
    const query = `
    INSERT INTO products (product_name, description, price, stock)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
    const values = ["product1", "product test 1", 1, 2];
    const res = await pool.query(query, values);
    console.log("Inserted order:", res.rows[0]);

    const query2 = `
    INSERT INTO customers (customer_name)
    VALUES ($1) RETURNING *;
  `;
    const values2 = ["customer 1"];
    const res2 = await pool.query(query2, values2);
    console.log("Inserted order:", res2.rows[0]);

    const query3 = `
    INSERT INTO orders (orders_name)
    VALUES ($1) RETURNING *;
  `;
    const values3 = ["order 1"];
    const res3 = await pool.query(query3, values3);
    console.log("Inserted order:", res3.rows[0]);

    
  } catch (err) {
    console.error("Error inserting into DB", err);
  }
}

module.exports = { initDB, insertInto };
