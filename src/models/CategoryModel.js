const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CategoryModel = new Schema(
    {
        _id: {
            type: Schema.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        parentId: {
            type: Schema.ObjectId,
        },
        createdBy: {
            type: Schema.ObjectId,
        },
        updatedBy: {
            type: Schema.ObjectId,
        },
        deletedBy: {
            type: Schema.ObjectId,
        },
        deletedAt: {
            type: Date,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'categories',
        timestamps: true,
    }
);

CategoryModel.virtual("createdByObj", {
    ref: "users",
    localField: "createdBy",
    foreignField: "_id",
    justOne: true
});
CategoryModel.virtual("updatedByObj", {
    ref: "users",
    localField: "updatedBy",
    foreignField: "_id",
    justOne: true
});
CategoryModel.virtual("deletedByObj", {
    ref: "users",
    localField: "deletedBy",
    foreignField: "_id",
    justOne: true
});
CategoryModel.virtual("parentObj", {
    ref: "categories",
    localField: "parentId",
    foreignField: "_id",
    justOne: true
});
module.exports = mongoose.model('categories', CategoryModel);
