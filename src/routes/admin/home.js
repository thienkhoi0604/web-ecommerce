const { Router } = require("express");
const { HomeController } = require("../../controllers/admin");

var HomeRouter = Router();

HomeRouter.get("/", HomeController.index);

HomeRouter.get('/admin', (req, res) => {
    res.render('admin');
});

module.exports = HomeRouter;