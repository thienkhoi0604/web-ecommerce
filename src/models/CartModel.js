const { Schema, default: mongoose } = require("mongoose")

const cartModel = new Schema({
    userId: { type: String },
    cartId: { type: String },
    status: { type: String, default: 'active' },
    modifiedOn: { type: Date, default: Date.now },
    products: { type: Array },
}, {
    collection: 'carts',
    timestamps: true
})

module.exports = mongoose.model("products", productModel)