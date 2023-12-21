const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");

const routes = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/admin", AdminRouter)
    app.use("/", ClientRouter)
}

module.exports = routes;
