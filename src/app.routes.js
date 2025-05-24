const { Router } = require("express");
const { productRoutes } = require("./modules/product/product.router");

const mainRouter = Router();

mainRouter.use("/product", productRoutes);

module.exports = mainRouter;
