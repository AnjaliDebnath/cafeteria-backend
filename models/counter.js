const mongoose= require('mongoose');

const CounterSchema= new mongoose.Schema({
    merchant_id:{type:[mongoose.Schema.Types.ObjectId]},
    dish_id:{type:[mongoose.Schema.Types.ObjectId], required:true},
    

})

module.exports= mongoose.model('Counter', CounterSchema);
