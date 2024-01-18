const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const ErrorController = {
    _404(req, res, next) {
        res.render("admin/404", Response({ res, data: { layout: false } }))
    }
}

module.exports = ErrorController;