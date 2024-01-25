const { Response } = require("../../commons");
const categoryService = require("../../services/categoryService");

const ErrorController = {
    async _404(req, res, next) {
        const categories = await categoryService.getNestedAll();

        res.render('client/404', Response({ res, data: { categories } }));
    }
}

module.exports = ErrorController;