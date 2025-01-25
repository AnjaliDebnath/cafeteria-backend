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

router.post('/', async(req, res)=>{
    try{
        const dish = new Dish(req.body);
        await dish.save();
        res.status(201).json(dish);

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
