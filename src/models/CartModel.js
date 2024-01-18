const { Schema, default: mongoose } = require("mongoose")

const cartModel = new Schema({
    _id: Schema.ObjectId,
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
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    collection: 'carts',
    timestamps: true
})

module.exports = mongoose.model("carts", cartModel)