const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const CategoryController = {
    index(req, res, next) {
        res.render("admin/categries", Response({ res, data: {} }))
    }
}

module.exports = CategoryController;