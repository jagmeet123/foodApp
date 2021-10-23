const mongoose = require('mongoose');
const { db_link } = process.env || require('../secrets')

mongoose.connect(db_link).then(() => {
    console.log('plan Model database connected');
}).catch((err) => {
    console.log('error', err)
})

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Kindly pass the name"],
        unique: [true, "Plan name should be unique"],
        maxlength: [40, "plan name should be less than 40 characters"]
    },

    duration: {
        type: String,
        required: [true, "Please provide the duration"]
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price
            },
            message: "Discount should be less than actual price"
        }
    },

    planImages: {
        type: [String]
    },

    reviews: {
        type: [mongoose.Schema.objectId],
        ref: "reviewModel",
    },
    
    averageRating: Number
})

const planModel = mongoose.model("planModel", planSchema)
module.exports = planModel