const CheckoutController = {
    async index(req, res, next) {
        res.render('client/checkout');
    },
}

module.exports = CheckoutController;