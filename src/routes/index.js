const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");

const routes = (app) => {
    app.use("/", AuthRouter)
    app.use("/admin", AdminRouter)
    app.use("/", ClientRouter)
}

module.exports = routes;
