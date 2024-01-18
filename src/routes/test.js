const { Router } = require('express');


const TestRouter = Router();

TestRouter.get('/test', (req, res) => {
    res.render('test', { layout: false });
});

module.exports = TestRouter;