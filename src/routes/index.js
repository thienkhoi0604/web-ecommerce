const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");
const { author } = require("../middlewares");
const { USER_ROLE } = require("../constants");

const routes = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/admin", author(USER_ROLE.ADMIN), AdminRouter)
    app.use("/",author(USER_ROLE.USER), ClientRouter)
}

module.exports = routes;
