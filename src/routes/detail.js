const { Router } = require('express');


const DetailRouter = Router();

DetailRouter.get('/detail', (req, res) => {
    res.render('detail', { layout: false });
});

module.exports = DetailRouter;