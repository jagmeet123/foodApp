const mongoose = require('mongoose');
const { db_link } =process.env;
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

userSchema.pre('save', function (next) {
    this.confirmPassword = undefined;
    next()
});

userSchema.methods.resetHandler = function(password,confirmPassword){
    this.password = password,
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