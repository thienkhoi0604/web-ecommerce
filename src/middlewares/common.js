const common = (req, res, next) => {
    res.locals = res.locals || {};
    res.locals.logged = !!req.cookies.auth || !!req.headers.auth;
    next();
}

module.exports = common;