const dotenv= require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes= require('./routes/userRoutes');
const cartRoutes= require('./routes/cartRoutes');
const dishRoutes= require('./routes/dishRoutes');
const counterRoutes= require('./routes/counterRoutes');
const authRoutes= require('./routes/authRoutes');

const mongodb = require("mongodb");
const connectDb = require("./database");

const cors= require('cors');

const PORT = process.env.PORT;
const MONGO_URI= process.env.MONGO_URI;

connectDb();

app.use(cors({
    origin: 'http://localhost:5173', credentials:true
  })); 

app.use('/user', userRoutes);
app.use('/dish', dishRoutes);
app.use('/cart', cartRoutes);
app.use('/counter', counterRoutes);
app.use('/auth', authRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));