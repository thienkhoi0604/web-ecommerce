const Product = require('../../models/ProductModel');
const { Response } = require('../../commons');
const ProductModel = require('../../models/ProductModel');
const categoryService = require('../../services/categoryService');

const ProductController = {
    async index(req, res, next) {
        const products = await ProductModel.find({}).limit(9).lean();
        const categories = await categoryService.getNestedAll();
        res.render('client/product', Response({ res, data: { products, categories } }));
    },
    async search(req, res, next) {
        const page = Number.parseInt(req.query.page) || 1;
        delete req.query.page;
        const limit = Number.parseInt(req.query.limit) || 9;
        delete req.query.limit;
        const query = {
            isDeleted: false,
            $or: [
            ]
        }
        const numberFields = [];
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
            ProductModel.find(query).skip((page - 1) * limit).limit(limit).sort({ updatedAt: -1, createdAt: -1 }).lean(),
            ProductModel.find(query).countDocuments().lean()
        ]);
        const pagination = {
            page,
            limit,
            total: results[1],
            totalPage: Math.ceil(results[1] / limit),
            data: results[0]
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