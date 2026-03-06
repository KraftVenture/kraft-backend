require("dotenv").config()
const pool = require('./src/db/config.js')
const dotenv = require('dotenv')
const cors = require('cors')
const express = require('express')

const app = express()
// app.use(cors())
const corsOptions = {
  origin: ['http://localhost:5173', 'https://kraft-venture.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json())

// async function testDB() {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("Connected! Time:", res.rows[0]);
//   } catch (err) {
//     console.error("DB connection failed:", err);
//   }
// }

app.get('/', (req, res) => {
  res.send({
    message: "server running!"
  })
})

require('./src/routes/form.routes.js')(app)

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
})