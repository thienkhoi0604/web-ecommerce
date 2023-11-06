const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const HomeController = {
    index(req, res, next) {
        res.render("client/home", Response(res))
    }
}

module.exports = HomeController;