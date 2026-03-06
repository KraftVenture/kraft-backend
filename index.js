require("dotenv").config()
const pool = require('./src/db/config.js')
const dotenv = require('dotenv')
const cors = require('cors')
const express = require('express')

const app = express()
app.use(cors())
app.use(express.json())

// async function testDB() {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("Connected! Time:", res.rows[0]);
//   } catch (err) {
//     console.error("DB connection failed:", err);
//   }
// }

require('./src/routes/form.routes.js')(app)

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
})