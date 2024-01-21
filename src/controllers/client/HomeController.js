const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const Product = require("../../models/ProductModel")

const HomeController = {
    async index(req, res, next) {
        try {
            const products = await Product.find().lean();
            res.render("client/home", Response({ res, data: { products } }));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = HomeController;