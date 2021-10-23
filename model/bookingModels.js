const mongoose = require("mongoose");
let { db_link } = process.env || require("../secrets");
mongoose.connect(db_link).then(function (db) {
    // console.log(db);
    console.log("connected to db")
}).catch(function (err) {
    console.log("err", err);
});
const bookingSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    boughtAtPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: [true, "Booking must belong to a user"]
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "Booking must belong to a plan "]
    },
    status: {
        type: String,
        enum: ["pending", "successful", "rejected"],
        default: "pending"
    }
})
const BookingModel =
    mongoose.model("bookingModel", bookingSchema);
module.exports = BookingModel;