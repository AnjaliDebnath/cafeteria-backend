const express = require('express');
const router =  express.Router();
const User= require('../models/user');

router.post('/:userId/cart', async (req, res) => {
    try{
        const {item, quantity}= req.body;
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        user.cart.push({item, quantity});
        res.status(200).json({message: 'item added to cart', cart:user.cart});

    }catch(err){
        res.status(500).json({error:"failed to add item to cart", details: err.message});
    }
});

router.get('/:userId/cart', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json({message: 'User cart', cart: user.cart});
    }catch(err) {
        res.status(500).json({error:"failed to get user cart", details: err.message});
    }
})

router.delete('/:userId/cart/:itemId', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.userId, {$pull: {cart: {_id: req.params.itemId}}}, {new: true});
        if(!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json({message: 'item removed from cart', cart: user.cart});
    }catch(err) {
        res.status(500).json({error:"failed to remove item from cart", details: err.message});
    }
});

router.put('/:userId/cart', async (req, res) => {
    try {
        const { item, quantity } = req.body;
       const user = await User.findById(req.params.userId);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
        const cartItem = user.cart.find((cart) => cart.item.toString() === item);
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      cartItem.quantity = quantity;
      await user.save();
      res.status(200).json({ message: 'Cart item updated successfully', cart: user.cart });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update cart item', details: err.message });
    }
  });
  

  router.delete('/:userId/cart/:itemId', async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Filter out the item to delete
      const originalCartLength = user.cart.length;
      user.cart = user.cart.filter((cart) => cart.item.toString() !== itemId);
  
      if (user.cart.length === originalCartLength) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Cart item deleted successfully', cart: user.cart });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete cart item', details: err.message });
    }
  });


module.exports= router;