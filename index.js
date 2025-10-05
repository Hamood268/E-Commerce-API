require('dotenv').config();
const { initDB, insertInto } = require('./api/database/schemas/schemas.js')

const pool = require('./api/database/database.js');

pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Connection error", err.stack));

// iniate schemas 
initDB()
insertInto()