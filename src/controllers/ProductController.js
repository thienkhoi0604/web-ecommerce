const mongoose = require('mongoose');
const Product = require('../models/ProductModel');

const ProductController = {
    async getAllProducts(req, res, next) {
        try {
            const products = await Product.find().lean();
            res.render('products', { layout: false, products });
        } catch (error) {
            next(error);
        }
    },
    getProductsByCategory(req, res) {

    },
    searchProducts(req, res) {

    }
}

module.exports = ProductController;