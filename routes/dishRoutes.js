const express = require("express");
const router = express.Router();
const Dish = require("../models/dish");

router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find().select("-cart");
    res.status(200).json(dishes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch dishes", details: err.message });
  }
});


// POST route to add a new dish
router.post('/newDish', async (req, res) => {
  try {
    console.log(req.body)
    const { dish_name, description, price, image, category, availablility,  } = req.body;

    // Validate required fields
    if (!dish_name || !description || !price || !category ) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Create a new Dish document
    const newDish = new Dish({
      dish_name,
      description,
      price,
      image: image || 'no image provided', // Default image if not provided
      category,
      availablility: availablility || 'Unavailable', // Default availability if not provided
     
    });

    // Save the dish to the database
    const savedDish = await newDish.save();

    res.status(201).json({
      message: 'Dish added successfully!',
      data: savedDish,
    });
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({
      message: 'Failed to add dish. Please try again later.',
      error: error.message,
    });
  }
});



router.post('/', async(req, res)=>{
    try {
        const dishes = req.body.dishes; // Expecting an array of dish objects in the request body
        console.log(dishes);
        // Validate if dishes is an array
        if (!Array.isArray(dishes) || dishes.length === 0) {
          return res.status(400).json({ error: 'Please provide an array of dishes.' });
        }
    
        // Validate each dish in the array
        const formattedDishes = dishes.map((dish) => {
          const { dish_name, description, price, image, category, availability, counter } = dish;
    
          
    
          return {
            dish_name,
            description,
            price,
            image,
            category,
            availability,
            counter,
          };
        });
    
        // Insert multiple dishes into the database
        const savedDishes = await Dish.insertMany(formattedDishes);
        console.log("savedDishes");
        res.status(201).json({
          message: 'Dishes created successfully.',
          dishes: savedDishes,
        });

    }
    catch(err){
        res.status(500).json({error: "Failed to add dish", details: err.message});
    }

});

router.get('/id/:id', async (req, res) => {
    try {
      const dish = await Dish.findById(req.params.id); 
        if (!dish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      res.status(200).json(dish);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dish', details: err.message });
    }
  });
  
  
  router.put('/id/:id', async (req, res) => {
    try {
      const { dish_name, description, price, image, category, availablility, counter } = req.body;
  
      const updatedDish = await Dish.findByIdAndUpdate(
        req.params.id,
        { dish_name, description, price, image, category, availablility, counter },
        { new: true } 
      );
  
      if (!updatedDish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
  
      res.status(200).json({ message: 'Dish updated successfully', dish: updatedDish });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update dish', details: err.message });
    }
  });
  
 
  router.delete('/id/:id', async (req, res) => {
    try {
      const deletedDish = await Dish.findByIdAndDelete(req.params.id); 
      if (!deletedDish) {
        return res.status(404).json({ error: 'Dish not found' });
      }
      res.status(200).json({ message: 'Dish deleted successfully', dish: deletedDish });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete dish', details: err.message });
    }
  });

module.exports = router;
