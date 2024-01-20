const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const StaticController = {
    index(req, res, next) {
        res.render("admin/statics", Response({ res, data: {} }))
    }
}

module.exports = StaticController;