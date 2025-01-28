const mongoose = require('mongoose');

const DishSchema= new mongoose.Schema({
    dish_name:{type:'string', required:'true'},
    description:{type:'string', required:'true'},
    price:{type:'number', required:'true'},
    image:{type:'string', },
    category:{type:'string', required:'true'},
    availablility:{type:'string', },
    counter:{type:[mongoose.Schema.Types.ObjectId]},
    

})

module.exports=mongoose.model('Dish', DishSchema);