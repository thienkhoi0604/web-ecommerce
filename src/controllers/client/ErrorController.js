const ErrorController = {
    async _404(req, res, next) {
        
        res.render('client/404');
    }
}

module.exports = ErrorController;