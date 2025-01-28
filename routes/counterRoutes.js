const express = require('express');
const router =  express.Router();
const Counter = require('../models/counter');

router.post("/", async (req, res) => {
    try {
      const {
        merchants,
        dishes,
        counter_name,
        description,
        location,
        imageUrl,
        operating_hours,
        isActive,
      } = req.body;
  
      if (!counter_name) {
        return res.status(400).json({ error: "Counter name is required." });
      }
  
      const formattedDishes =
      Array.isArray(dishes) && dishes.every((id) => typeof id === "string")
        ? dishes
        : [];

    const newCounter = new Counter({
      merchants,
      dishes: formattedDishes,
        counter_name,
        description,
        location,
        imageUrl,
        operating_hours,
        isActive,
      });
  
      const savedCounter = await newCounter.save();
      res.status(201).json({
        message: "Counter created successfully.",
        counter: savedCounter,
      });
    } catch (error) {
      console.error("Error creating counter:", error);
      res.status(500).json({
        error: "Server error. Could not create counter.",
        details: error.message, // Include additional details
      });
    }
  });
  
  router.post("/bulk", async (req, res) => {
    try {
      const { counters } = req.body;
  
      if (!Array.isArray(counters) || counters.length === 0) {
        return res.status(400).json({ error: "Counters array is required." });
      }
  
      const formattedCounters = counters.map((counter) => {
        const {
          merchants = [],
          dishes = [],
          counter_name,
          description,
          location,
          imageUrl,
          operating_hours = {},
          isActive = true,
        } = counter;
  
        // Ensure merchants and dishes are valid arrays of strings
        const formattedDishes =
          Array.isArray(dishes) && dishes.every((id) => typeof id === "string")
            ? dishes
            : [];
  
        const formattedMerchants =
          Array.isArray(merchants) && merchants.every((id) => typeof id === "string")
            ? merchants
            : [];
  
        return {
          merchants: formattedMerchants,
          dishes: formattedDishes,
          counter_name,
          description,
          location,
          imageUrl,
          operating_hours,
          isActive,
        };
      });
  
      // Insert all counters in one operation
      const savedCounters = await Counter.insertMany(formattedCounters);
  
      res.status(201).json({
        message: "Counters created successfully.",
        counters: savedCounters,
      });
    } catch (error) {
      console.error("Error creating counters:", error);
      res.status(500).json({
        error: "Server error. Could not create counters.",
        details: error.message,
      });
    }
  });
  
  
  router.get('/', async (req, res) => {
    try {
      const counters = await Counter.find(); 
      res.status(200).json(counters);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch counters', details: err.message });
    }
  });
  
 
  router.get('/id/:id', async (req, res) => {
    try {
      const counter = await Counter.findById(req.params.id); 
      if (!counter) {
        return res.status(404).json({ error: 'Counter not found' });
      }
      res.status(200).json(counter);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch counter', details: err.message });
    }
  });

  router.put('/id/:id', async (req, res) => {
    try {
      const counter = await Counter.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!counter) {
        return res.status(404).json({ error: 'Counter not found' });
      }
      res.status(200).json(counter);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update counter', details: err.message });
    }
  });

  router.delete('/id/:id', async (req, res) => {
    try {
      const counter = await Counter.findByIdAndDelete(req.params.id);
      if (!counter) {
        return res.status(404).json({ error: 'Counter not found' });
      }
      res.status(200).json({ message: 'Counter deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete counter', details: err.message });
    }
  });
  
  module.exports = router;


module.exports= router;