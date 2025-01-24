const dotenv= require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
app.use(express.json());

const userRoutes= require('./routes/userRoutes');
const cartRoutes= require('./routes/cartRoutes');
const dishRoutes= require('./routes/dishRoutes');
const counterRoutes= require('./routes/counterRoutes');

const mongodb = require("mongodb");
const connectDb = require("./database");

const cors= require('cors');

const PORT = process.env.PORT;
const MONGO_URI= process.env.MONGO_URI;

connectDb();

app.use('/user', userRoutes);
app.use('/dish', dishRoutes);
app.use('/cart', cartRoutes);
app.use('/counter', counterRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));