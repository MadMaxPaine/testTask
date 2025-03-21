const Router = require("express");
const router = new Router();
const orderRouter = require("./ordersRoutes");

router.use("/orders", orderRouter);

module.exports = router;
