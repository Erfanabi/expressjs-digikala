const { Router } = require("express");
const { createProductValidation } = require("./validation");
const { createProductHandler } = require("./product.servise");

const router = Router();

router.post("/products", createProductValidation, createProductHandler);

module.exports = {
  productRoutes: router,
};
