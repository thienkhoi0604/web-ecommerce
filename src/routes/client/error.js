const { Router } = require('express');
const { ErrorController } = require('../../controllers/client');

const ErrorRouter = Router();

ErrorRouter.get('*', ErrorController._404);

module.exports = ErrorRouter;
