const { Schema, default: mongoose } = require("mongoose")

const productModel = new Schema({
    _id: Schema.ObjectId,
    productId: {
        type: String
    },
    name: {
        type: String
    },
    review: {
        type: String
    },
    description: {
        type: String
    },
    sizes: {
        type: Number
    },
    colors: {
        type: String
    },
    quantity: {
        type: Number
    },
    specs: {
        type: Array, default: []
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
    collection: 'products',
    timestamps: true
})

module.exports = mongoose.model("products", productModel)