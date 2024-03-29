const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const { CategoryModel } = require("../../models");
const ProductModel = require("../../models/ProductModel");
const categoryService = require("../../services/categoryService");

const HomeController = {
    async index(req, res, next) {
        const products = await ProductModel.find({}).limit(8).lean();
        const bestProducts = await ProductModel.find({}).sort({ soldOut: -1 }).limit(8).lean();
        const categories = await categoryService.getNestedAll();
        res.render("client/home", Response({ res, data: { home: true, products, categories, bestProducts } }));
    },
    async aboutUs(req, res, next) {
        const categories = await categoryService.getNestedAll();
        res.render("client/about-us", Response({ res, data: { categories } }));
    },
    async contact(req, res, next) {
        const categories = await categoryService.getNestedAll();
        res.render("client/contact", Response({ res, data: { categories } }));
    },
}

module.exports = HomeController;