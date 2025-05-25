const { Router } = require("express");
const { createProductValidation } = require("./validation");
const {
  createProductHandler,
  getProductsHandler,
  getProductDetailByIdHandler,
} = require("./product.servise");

const router = Router();

router.post("/", createProductValidation, createProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", getProductDetailByIdHandler);

module.exports = {
  productRoutes: router,
};
