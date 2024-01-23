const { Response } = require("../../commons");

const ProfileController = {
    async index(req, res, next) {
        res.render('client/profile', Response({ res, data: { profile: true } }));
    },
}

module.exports = ProfileController;