const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const Product = require("../../models/ProductModel")

const HomeController = {
    async index(req, res, next) {
        res.render("client/home", Response({ res, data: { home: true } }));
    },
    async aboutUs(req, res, next) {
        res.render("client/about-us", Response({ res, data: {} }));
    },
    async contact(req, res, next) {
        res.render("client/contact", Response({ res, data: {} }));
    },
}

module.exports = HomeController;