const express = require('express');
const router =  express.Router();
const User= require('../models/user');


router.get('/', async (req, res)=>{
    try {
        const users = await User.find(); 
        res.status(200).json(users); 
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
      }
    
})

router.get('/merchant', async(req, res)=>{
    try {
        
        // const users = await User.find();
        // console.log(users);
        
        const merchants = await User.find({ role: 'merchant' });
        
        res.status(200).json({merchants}); 
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch merchants', details: err.message });
      }
  })



router.post('/', async (req, res)=>{
    try {
        const user = new User(req.body); 
        const savedUser = await user.save(); 
        res.status(201).json(savedUser); 
      } catch (err) {
        res.status(400).json({ error: 'Failed to add user', details: err.message });
      }
})

router.get('/id/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id); 
        if (!user) {
          return res.status(404).json({ error: 'User not found' }); 
        }
        res.status(200).json(user); 
      } catch (err) {
        res.status(400).json({ error: 'Failed to fetch user', details: err.message }); 
      }

})



router.put('/id/:id', async (req, res)=>{
   
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true}); 
        if (!user) {
          return res.status(404).json({ error: 'User not found' }); 
        }
        res.status(200).json(user); 
      } catch (err) {
        res.status(400).json({ error: 'Failed to update user', details: err.message });  
        }
});


router.delete('/id/:id', async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user) {
          return res.status(404).json({ error: 'User not found' }); 
        }
        res.status(200).json({message:"User deleted"});
      } catch (err) {
        res.status(400).json({ error: 'Failed to delete user', details: err.message });  
        }
   
});

router.post('/create-merchant', async (req, res) => {
    try {
      
        const { role, name, email, password, phone } = req.body;
      console.log(role);
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Only admins can create merchants.' });
      }
    
      // Create a new merchant
      const newMerchant = new User({
        name,
        email,
        password,
        phone,
        
        role: 'merchant', 
      });
      const savedMerchant = await newMerchant.save(); 
      res.status(201).json({ message: 'Merchant created successfully', merchant: savedMerchant });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create merchant', details: err.message });
    }
  });


module.exports= router;