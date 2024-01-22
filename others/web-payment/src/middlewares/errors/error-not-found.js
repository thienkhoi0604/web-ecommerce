const { NotFoundError } = require("../../helpers/errors/error-not-found");

const errorNotFound = (req, res, next) => next(new NotFoundError());

module.exports = { errorNotFound };
