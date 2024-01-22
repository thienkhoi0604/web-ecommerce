const CardRouter = require("./card");
const PaymentRouter = require("./payment");

const routes = (app) => {
    app.use("/card", CardRouter);
    app.use("/payment", PaymentRouter);
}

module.exports = routes;
