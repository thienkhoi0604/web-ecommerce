const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    img: { type: String, maxLength: 255 },
    name: { type: String, maxLength: 255 },
    price: { type: String, maxLength: 255 },
    category: { type: String, required: true },
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;