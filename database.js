const MONGO_URI= process.env.MONGO_URI;
const mongoose= require('mongoose');

const connectDb= async()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected Successfully...');

    }catch(err){
        console.error('Error connecting to MongoDB:',err.message);
        
    }

};

module.exports=connectDb;