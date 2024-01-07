const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");
const CartRouter = require("./cart")

const routes = (app) => {
    app.use("/", AuthRouter)
    app.use("/admin", AdminRouter)
    app.use("/", ClientRouter)
    app.use("/", CartRouter)
}

module.exports = routes;
