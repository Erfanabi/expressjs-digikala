const { Router } = require("express");
const { productRoutes } = require("./modules/product/product.routes");
const { authRoutes } = require("./modules/auth/auth.routes");

const mainRouter = Router();

mainRouter.use("/product", productRoutes);
mainRouter.use("/auth", authRoutes);

module.exports = mainRouter;
