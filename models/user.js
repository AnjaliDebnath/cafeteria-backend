const mongoose = require('mongoose');

const CartItem= new mongoose.Schema({
    item:{type:mongoose.Schema.Types.ObjectId, ref:"Dish"},
    quantity:{type:"number",required:"true"},
    
});

const UserSchema= new mongoose.Schema({
    name:{type:"string",required:"true"},
    email:{type:"string",required:"true", unique:true},
    password:{type:"string",required:"true"},
    phone:{type:"string",},
    cart:{type:[CartItem], },
    role:{type:"string", enum:["customer", "merchant", "admin"], default:"customer"}

});

module.exports=mongoose.model('User', UserSchema)