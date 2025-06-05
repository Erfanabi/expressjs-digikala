const { Router } = require("express");
const { productRoutes } = require("./modules/product/product.routes");
const { authRoutes } = require("./modules/auth/auth.routes");
const { basketRoutes } = require("./modules/basket/basket.routes");
const { paymentRoutes } = require("./modules/payment/payment.routes");

const mainRouter = Router();

mainRouter.use("/product", productRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/basket", basketRoutes);
mainRouter.use("/payment", paymentRoutes);

module.exports = mainRouter;
