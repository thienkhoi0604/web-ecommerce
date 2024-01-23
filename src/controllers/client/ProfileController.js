const ProfileController = {
    async index(req, res, next) {
        res.render('client/profile');
    },
}

module.exports = ProfileController;