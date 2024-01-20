const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");

const UserController = {
    index(req, res, next) {
        res.render("admin/users", Response({ res, data: {} }))
    }
}

module.exports = UserController;