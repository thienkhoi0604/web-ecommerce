const { Response } = require("../../commons");
const categoryService = require("../../services/categoryService");

const CheckoutController = {
    async index(req, res, next) {
        const categories = await categoryService.getNestedAll();
        res.render('client/checkout', Response({ res, data: { categories } }));
    },
}

module.exports = CheckoutController;