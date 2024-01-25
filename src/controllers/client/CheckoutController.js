const { Response } = require("../../commons");
const categoryService = require("../../services/categoryService");

const CheckoutController = {
    async index(req, res, next) {
        const categories = await categoryService.getNestedAll();
        res.render('client/checkout', Response({ res, data: { categories } }));
    },
    async info(req, res, next) {
        
    },
    async card(req, res, next) {
    },
}

module.exports = CheckoutController;