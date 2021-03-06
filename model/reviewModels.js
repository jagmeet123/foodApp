const mongoose = require('mongoose');
let db_link;
if(process.env.db_link){
    db_link = process.env.db_link;
}else{
    db_link = require('../secrets').db_link
}
const planModel =require('../model/planModels')
const userModel =require('../model/userModels')

mongoose.connect(db_link).then(()=>{
    console.log('db connected booking')
}).catch((err)=>{
    console.log(err.message);
})

const reviewSchema = new mongoose.Schema({
    review:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Review must have a rating"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"userModel",
        required:[true,"Review must have a rating"]
    },
    
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:"planModel",
        required:[true,"Review must have a rating"]
    }
})

const reviewModel = mongoose.model("reviewModel",reviewSchema);
module.exports = reviewModel;