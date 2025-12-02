require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

//Connect to DB 
connectDB().then(() => {

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));

  //Import routes
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
});
