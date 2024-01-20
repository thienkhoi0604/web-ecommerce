const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const HomeController = {
    index(req, res, next) {
        res.render("admin/home", Response({ res, data: {  } }))
    }
}

module.exports = HomeController;