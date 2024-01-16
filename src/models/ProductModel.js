const { Schema, default: mongoose } = require("mongoose")

const productModel = new Schema({
    _productId: Schema.ObjectId,
    productId: { type: String },
    name: { type: String },
    review: { type: String },
    description: { type: String },
    sizes: { type: Number },
    colors: { type: String },
    quantity: { type: Number },
    specs: { type: Array, default: [] }
}, {
    collection: 'products',
    timestamps: true
})

module.exports = mongoose.model("products", productModel)