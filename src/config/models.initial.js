const {
  Product,
  ProductDetail,
  ProductColor,
  ProductSize,
} = require("/src/modules/product/product.model");
const sequelize = require("./sequelize.config"); // مسیر مدل‌ها را تنظیم کنید

async function initDatabase() {
  // یک محصول چند جزئیات دارد
  Product.hasMany(ProductDetail, {
    foreignKey: "productId", // در مدل مقصد
    sourceKey: "id", // در مدل منبع
    as: "details",
  });
  ProductDetail.belongsTo(Product, {
    foreignKey: "productId", // در مدل مقصد
    targetKey: "id", // در مدل منبع (هدف)
    as: "product",
  });

  // یک محصول چند رنگ دارد
  Product.hasMany(ProductColor, {
    foreignKey: "productId",
    sourceKey: "id",
    as: "colors",
  });
  ProductColor.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
    as: "product",
  });

  // یک محصول چند سایز دارد
  Product.hasMany(ProductSize, {
    foreignKey: "productId",
    sourceKey: "id",
    as: "sizes",
  });
  ProductSize.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
    as: "product",
  });

  await sequelize.sync({ alter: true });
}

module.exports = initDatabase;
