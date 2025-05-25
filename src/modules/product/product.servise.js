const createHttpError = require("http-errors");
const { ProductTypes } = require("../../common/constant/product.const");
const {
  ProductDetail,
  ProductColor,
  ProductSize,
  Product,
} = require("./product.model");

async function createProductHandler(req, res, next) {
  try {
    const {
      title,
      description,
      type,
      price = undefined,
      discount = undefined,
      active_discount = undefined,
      count = undefined,
      details, // آرایه { key, value }
      colors, // آرایه { color_name, color_code, count, price, discount?, active_discount? }
      sizes, // آرایه { size, count, price, discount?, active_discount? }
    } = req.body;

    if (!Object.values(ProductTypes).includes(type)) {
      throw createHttpError(400, "Invalid product type");
    }

    const product = await Product.create({
      title,
      description,
      price,
      discount,
      active_discount,
      type,
      count,
    });

    if (details && Array.isArray(details)) {
      let dataList = [];
      for (const item of details) {
        dataList.push({
          key: item?.key,
          value: item?.value,
          productId: product.id,
        });
      }

      if (dataList.length > 0) {
        await ProductDetail.bulkCreate(dataList);
      }
    }

    if (type === ProductTypes.Coloring) {
      if (details && Array.isArray(colors)) {
        let colorList = [];
        for (const item of colors) {
          colorList.push({
            color_name: item?.name,
            color_code: item?.code,
            productId: product.id,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
          });
        }

        if (colorList.length > 0) {
          await ProductColor.bulkCreate(colorList);
        }
      }
    }

    if (type === ProductTypes.Sizing) {
      if (sizes && Array.isArray(sizes)) {
        let sizeList = [];
        for (const item of sizes) {
          sizeList.push({
            size: item?.size,
            productId: product.id,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
          });
        }

        if (sizeList.length > 0) {
          await ProductSize.bulkCreate(sizeList);
        }
      }
    }

    return res.json({
      message: "create product successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createProductHandler };
