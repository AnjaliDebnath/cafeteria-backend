const express = require('express');
const router =  express.Router();
const Counter = require('../models/counter');

router.post('/', async (req, res) => {
    try {
      const { merchant_id } = req.body;
  
     
      if (!merchant_id ) {
        return res.status(400).json({ error: 'merchant_id must be an array of valid ObjectIds.' });
      }
  
     
      const newCounter = new Counter({ merchant_id });
      const savedCounter = await newCounter.save();
  
      res.status(201).json({ message: 'Counter created successfully', counter: savedCounter });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create counter', details: err.message });
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