const checkAuthentication = (req, res, next) => {
    const authCookie = req.cookies.auth;
    if (authCookie) {
        res.locals.authCookieValue = authCookie;
        res.locals.loggedIn = true;
    } else {
        res.locals.loggedIn = false;
    }
    next();
}

module.exports = checkAuthentication;