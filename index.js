require("dotenv").config();
const pool = require('./src/db/config.js');
const cors = require('cors');
const express = require('express');

const app = express();

const corsOptions = {
  // origin: ['http://localhost:5173', 'https://kraft-venture.vercel.app'],
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: "server running!" });
});

require('./src/routes/form.routes.js')(app);

// ✅ Export for Vercel instead of app.listen
module.exports = app;