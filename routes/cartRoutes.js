const express = require('express');
const router =  express.Router();
const User= require('../models/user');
const Dish= require('../models/dish');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const {checkUser} = require('../middlewares/checkUser');


router.post('/', checkUser, async (req, res) => {
  console.log(req.body);
  const { dishId, quantity } = req.body;
  
  try {
    console.log(req.body);
    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ error: 'Dish not found' });

    const cartItem = req.user.cart.find(item => item.item.toString() === dishId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      req.user.cart.push({ item: dishId, quantity });
    }

    await req.user.save();
    res.status(200).json({ message: 'Dish added to cart', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.post('/items', checkUser, async (req, res) => {
  try {
    const cartItems = await Promise.all(
      req.user.cart.map(async (cartItem) => {
        const dish = await Dish.findById(cartItem.item);
        return {
          dish: dish ? dish.dish_name : 'Dish not found',
          quantity: cartItem.quantity,
        };
      })
    );

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', checkUser, async (req, res) => {
  
  try {
    // console.log(req.user)
    const user = await User.findById(req.user.id).populate({
      path: 'cart.item', // Populate the `item` field in the cart
      model: 'Dish', // Specify the model being referenced
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Map cart items with dish details
    const cartItems = user.cart.map((cartItem) => ({
      dish_name: cartItem.item?.dish_name || 'Dish not found',
      description: cartItem.item?.description || 'No description available',
      price: cartItem.item?.price || 0,
      image: cartItem.item?.image || 'No image available',
      category: cartItem.item?.category || 'No category specified',
      availability: cartItem.item?.availability || 'Unknown',
      counter: cartItem.item?.counter || [], // Counter will hold an array of IDs
      quantity: cartItem.quantity,
    }));

console.log(cartItems)
    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/update', checkUser, async (req, res) => {
  console.log(req.body);
  const { dishId, quantity } = req.body;
  
  if (!dishId || quantity === undefined || quantity < 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  console.log(req.user);
  try {
    const user = await User.findOne({name: req.user.user}); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const cartItem = user.cart.find((item) => item.item.toString() === dishId);
    console.log(cartItem);

    if (cartItem) {
      cartItem.quantity = quantity; // Update quantity of existing item
    } else {
      user.cart.push({ item: dishId, quantity }); // Add new item to cart
    }

    await user.save();
    res.status(200).json({
      message: 'Cart updated successfully',
      updatedCart: user.cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



// Delete cart item
router.delete('/delete', checkUser, async (req, res) => {
  const { dishId } = req.body;

  try {
    const cartIndex = req.user.cart.findIndex(item => item.item.toString() === dishId);
    if (cartIndex === -1) return res.status(404).json({ error: 'Dish not found in cart' });

    req.user.cart.splice(cartIndex, 1);

    await req.user.save();
    res.status(200).json({ message: 'Cart item deleted', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/deletecart', checkUser,async (req, res)=>{
  try{
    req.user.cart = [];
    await req.user.save();
    res.status(200).json({message: 'Cart deleted'});
  }catch(err){
    res.status(500).json({error: 'Failed to delete cart', details: err.message});
  }
})


module.exports= router;