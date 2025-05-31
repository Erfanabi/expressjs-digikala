const { Router } = require("express");
const { productRoutes } = require("./modules/product/product.routes");
const { authRoutes } = require("./modules/auth/auth.routes");
const { basketRoutes } = require("./modules/basket/basket.routes");

const mainRouter = Router();

mainRouter.use("/product", productRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/basket", basketRoutes);

module.exports = mainRouter;
