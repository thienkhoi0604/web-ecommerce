const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const ProductController = {
    index(req, res, next) {
        res.render("admin/products", Response({ res, data: {} }))
    }
}

module.exports = ProductController;