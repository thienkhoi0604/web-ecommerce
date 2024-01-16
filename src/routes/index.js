const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");
const CartRouter = require("./cart")
const ProductRouter = require("./products")
const DetailRouter = require("./detail")

const routes = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/admin", AdminRouter)
    app.use("/", ClientRouter)
    app.use("/", CartRouter)
    app.use("/", ProductRouter)
    app.use("/", DetailRouter)
}

module.exports = routes;
