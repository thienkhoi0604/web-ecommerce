const { Response } = require("../commons");

const AuthController = {
    index(req, res, next) {
        res.render("login", Response(res, { layout: false }))
    }
}

module.exports = AuthController;