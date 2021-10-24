const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

let db_link;

if(process.env.db_link){
    db_link = process.env.db_link;
}else{
    db_link = require('../secrets').db_link
}
const validator = require("email-validator");
mongoose.connect(db_link).then(() => {
    console.log('db connected');
    console.log("database connected");
}).catch((err) => {
    console.log(err)
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    age: {
        type: Number
    },

    email: {
        type: String,
        unique:true,
        required: true,
        validate: function () {
            return validator.validate(this.email);
        }
    },

    createdAt: {
        type: Date,
        default:Date.now
    },

    password: {
        type: String,
        required: true,
        min: 8
    },

    confirmPassword: {
        type: String,
        required: true,
        min: 8,
        validate: function () {
            return this.password == this.confirmPassword;
        }
    },

    token:String,
    role: {
        type:String,
        enum:["admin","ce","user"],
        default:"user"
    },
    bookings:{
        type:[mongoose.Schema.objectId],
        ref:"bookingModel"
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    this.confirmPassword = undefined;
    next()
});

userSchema.methods.resetHandler = async function(password,confirmPassword){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt);
    this.confirmPassword=confirmPassword,
    this.token=undefined
}

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;

// (async function userCreate() {
//     let user = {
//         name: 'Abhishek',
//         age: 20,
//         email: 'abcd@gmail1.com',
//         password: '12345678',
//         confirmPassword: '12345678'
//     }

//     let userObj = await userModel.create(user);
//     console.log(userObj);
// })();