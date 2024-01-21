const mongoose = require('mongoose');
const Product = require('../../models/ProductModel');

const ProductController = {
    async getAllProducts(req, res, next) {
        try {
            const products = await Product.find().lean();
            res.render('client/products', { layout: false, products });
        } catch (error) {
            next(error);
        }
    },
    async getProductsByCategory(req, res, next) {
        try {
            const category = req.params.category;
            const products = await Product.find({ category: category }).lean();
            res.render('client/products', { layout: false, products, category });
        } catch (error) {
            next(error);
        }
    },
    async searchProducts(req, res, next) {
        try {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                return res.redirect('/products');
            }

            const regex = new RegExp(searchTerm, 'i');

            const products = await Product.find({
                $or: [
                    { name: { $regex: regex } },
                ],
            }).lean();

            res.render('client/products', { layout: false, products, searchTerm });
        } catch (error) {
            next(error);
        }
    },
    async getProductDetail(req, res, next) {
        try {
            const productId = req.params._id;
            const product = await Product.findById(productId).lean();
            res.render('client/detail', { layout: false, product });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;