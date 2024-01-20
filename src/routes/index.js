const AdminRouter = require("./admin");
const AuthRouter = require("./auth");
const ClientRouter = require("./client");
const CartRouter = require("./cart")
const ProductRouter = require("./products")
const DetailRouter = require("./detail")
const TestRouter = require("./test");
const { author } = require("../middlewares");
const { USER_ROLE } = require("../constants");

const routes = (app) => {
    app.use("/auth", AuthRouter)
    app.use("/admin", author(USER_ROLE.ADMIN), AdminRouter)
    app.use("/", ClientRouter)
    app.use("/", CartRouter)
    app.use("/", ProductRouter)
    app.use("/", DetailRouter)
    app.use("/", TestRouter)
}

module.exports = routes;
