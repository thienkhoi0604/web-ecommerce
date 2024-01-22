const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");
const { author, checkAuthentication } = require("../middlewares");
const { USER_ROLE } = require("../constants");

const routes = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/admin", checkAuthentication, author(USER_ROLE.ADMIN), AdminRouter)
    app.use("/", checkAuthentication, ClientRouter)
}

module.exports = routes;
