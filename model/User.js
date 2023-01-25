const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String },
    price: { type: Number },
    thumbnail: { type: String },
    quantity: { type: Number, default: 1 },
    subtotal: { type: Number, default: 1 },
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: "3", maxLength: "50" },
    email: { type: String, required: true, unique: true, minLength: "3", maxLength: "50" },
    password: { type: String, required: true, minLength: "6" },
    cart: [cartSchema],
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("User", userSchema);