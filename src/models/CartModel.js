const { Schema, default: mongoose } = require("mongoose")

const cartModel = new Schema({
    userId: {
        type: String
    },
    cartId: {
        type: String
    },
    status: {
        type: String, default: 'active'
    },
    products: {
        type: Array
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    deletedBy: {
        type: String
    },
    deletedAt: {
        type: String
    },
    isDeleted: {
        type: String
    },
}, {
    collection: 'carts',
    timestamps: true
})

module.exports = mongoose.model("carts", cartModel)