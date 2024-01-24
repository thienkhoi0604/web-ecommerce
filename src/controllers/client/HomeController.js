const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const { CategoryModel } = require("../../models");
const ProductModel = require("../../models/ProductModel");
const Product = require("../../models/ProductModel")

const HomeController = {
    async index(req, res, next) {
        const products = await ProductModel.find({}).limit(8).lean();
        const categories = await CategoryModel.find({}).lean();
        res.render("client/home", Response({ res, data: { home: true, products } }));
    },
    async aboutUs(req, res, next) {
        res.render("client/about-us", Response({ res, data: {} }));
    },
    async contact(req, res, next) {
        res.render("client/contact", Response({ res, data: {} }));
    },
}

module.exports = HomeController;