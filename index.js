require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const { initDB } = require('./api/database/schemas/schemas.js')
const pool = require('./api/database/database.js');

const productsController = require('./api/v1/products.js')
const customersController = require('./api/v1/customers.js')
const ordersController = require('./api/v1/orders.js')

pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Connection error", err.stack));

// iniate schemas 
initDB()

app.use('/api/v1', productsController);
app.use('/api/v1', ordersController);
app.use('/api/v1', customersController);

// Wrong endpoint handler
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    status: "Not Found",
    message: "This endpoint doesn't exist",
  });
});

app.listen(port, () => {
  console.log('Server running on port 5000')
})