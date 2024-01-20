const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const CartController = {
    index(req, res, next) {
        res.render("admin/carts", Response({ res, data: {} }))
    }
}

module.exports = CartController;