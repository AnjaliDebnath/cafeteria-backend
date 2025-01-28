require("dotenv").config();
const express = require('express');
const router=express.Router();
const User= require('../models/user');
const bcrypt= require('bcryptjs');
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET= process.env.REFRESH_TOKEN_SECRET;
const sessions= new Set();

router.post("/register", async (req, res) => {
    try {

      const { name, password, email } = req.body;
      console.log(name, password, email);
  
      if (!name || !password || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User has been registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error registering user", error: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }
  
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const accessToken = generateToken({ user: user.name, id : user._id });
      const refreshToken = jwt.sign({ user: user.name, id :user._id }, REFRESH_TOKEN_SECRET);
   
      sessions.add(refreshToken);
      
      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        name: user.name, 
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  });
  


  function generateToken(data) {
    return jwt.sign(data, ACCESS_TOKEN_SECRET);
  }


module.exports= router;