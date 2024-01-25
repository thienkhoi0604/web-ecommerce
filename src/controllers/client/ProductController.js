const Product = require('../../models/ProductModel');
const { Response } = require('../../commons');
const ProductModel = require('../../models/ProductModel');
const categoryService = require('../../services/categoryService');
const { CategoryModel } = require('../../models');

const ProductController = {
    async index(req, res, next) {
        const results = await Promise.all([
            await ProductModel.find({}).limit(9).lean(),
            await categoryService.getNestedAll(),
            await ProductModel.aggregate([
                {
                    $project: {
                        elements: { $split: ["$color", ","] }
                    }
                },
                {
                    $unwind: "$elements"
                },
                {
                    $group: {
                        _id: "$elements",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]),
            await ProductModel.aggregate([
                {
                    $project: {
                        elements: { $split: ["$size", ","] }
                    }
                },
                {
                    $unwind: "$elements"
                },
                {
                    $match: {
                        elements: { $ne: "" }
                    }
                },
                {
                    $group: {
                        _id: "$elements",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]),
            await ProductModel.aggregate([
                {
                    $group: {
                        _id: "$originalPrice",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]),
            await ProductModel.aggregate([
                {
                    $group: {
                        _id: "$discountPrice",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: 5
                }
            ]),
        ]);
        let colors = results[2];
        const colorCount = colors.reduce((a, b) => a + b.count, 0);
        colors = colors.filter(i => !!i._id).slice(0, 5);
        let sizes = results[3];
        const sizeCount = sizes.reduce((a, b) => a + b.count, 0);
        sizes = sizes.filter(i => !!i._id).slice(0, 5);
        const discountPrices = results[5];
        const discountPriceCount = discountPrices.reduce((a, b) => a + b.count, 0);
        const originalPrices = results[4];
        const originalPriceCount = originalPrices.reduce((a, b) => a + b.count, 0);
        res.render('client/product', Response({
            res, data: {
                products: results[0],
                categories: results[1],
                colors,
                sizes,
                discountPrices,
                originalPrices,
                colorCount,
                sizeCount,
                discountPriceCount,
                originalPriceCount
            }
        }));
    },
    async search(req, res, next) {
        const page = Number.parseInt(req.query.page) || 1;
        delete req.query.page;
        const limit = Number.parseInt(req.query.limit) || 9;
        delete req.query.limit;
        const sortBy = req.query.sortBy || "updatedAt";
        delete req.query.sortBy;
        const query = {
            isDeleted: false,
            $or: [
            ]
        }
        const numberFields = ["originalPrice", "discountPrice"];
        const equalFields = ["isDeleted", 'categoryId'];
        for (let key in req.query) {
            const value = req.query[key];
            if (numberFields.includes(key) && !isNaN(value)) {
                query.$or.push({ [key]: value })
            } else if (equalFields.includes(key) && !!value) {
                query.$or.push({ [key]: value })
            } else if (!!value) {
                query.$or.push({ [key]: new RegExp(req.query[key], "i") })
            }
        }
        if (query.$or.length <= 0) {
            delete query.$or;
        }
        const results = await Promise.all([
            ProductModel.find(query).skip((page - 1) * limit).limit(limit).sort({ [sortBy]: -1, createdAt: -1 }).lean(),
            ProductModel.find(query).countDocuments().lean(),
            !!req.query.categoryId ? CategoryModel.findOne({ _id: req.query.categoryId }).lean() : null,
        ]);
        const pagination = {
            page,
            limit,
            total: results[1],
            totalPage: Math.ceil(results[1] / limit),
            data: results[0],
            extend: {
                categoryObj: results[2]
            }
        }
        res.json(pagination);
    },
    async get(req, res, next) {
        const { _id } = req.params;
        const product = await Product.findOne({ _id }).lean();
        const products = await Product.find({}).limit(8).lean();
        const categories = await categoryService.getNestedAll();
        res.render('client/product-detail', Response({ res, data: { product, categories, products } }));
    }
}

module.exports = ProductController;