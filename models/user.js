const mongoose = require('mongoose');

const CartItem= new mongoose.Schema({
    item:{type:mongoose.Schema.Types.ObjectId},
    quantity:{type:"number",required:"true"},
    
});

const UserSchema= new mongoose.Schema({
    name:{type:"string",required:"true"},
    email:{type:"string",required:"true", unique:true},
    password:{type:"string",required:"true"},
    phone:{type:"string",required:"true"},
    cart:{type:[CartItem], required:"true"},
    role:{type:"string",required:"true", enum:["customer", "merchant", "id"], default:"customer"}

});

module.exports=mongoose.model('User', UserSchema)