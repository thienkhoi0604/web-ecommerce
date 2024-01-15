const Product = require("../models/ProductModel");

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch {
        next(error);
    }
}

const getProductsByCategory = async (req, res, next) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch {
        next(error);
    }
}

const searchProducts = async (req, res, next) => {
    const { query } = req.query;
    try {
        const products = await Product.find({ name: { $regex: query, $option: "i" } });
        res.json(products);
    } catch {
        next(error);
    }
}

module.exports = { getAllProducts, getProductsByCategory, searchProducts };