const sequelize = require("./sequelize.config");
const {
  Product,
  ProductDetail,
  ProductColor,
  ProductSize,
} = require("../modules/product/product.model");
const { User, Otp } = require("../modules/user/user.model");
const { Basket } = require("../modules/basket/basket.model");
const { Discount } = require("../modules/discount/discount.model");
const { Order, OrderItems } = require("../modules/order/order.model");
const { Payment } = require("../modules/payment/payment.model");

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

  // هر کاربر یک OTP داره
  User.hasOne(Otp, { foreignKey: "userId", sourceKey: "id", as: "otp" });

  // هر OTP متعلق به یک کاربر است
  Otp.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });

  Product.hasMany(Basket, {
    foreignKey: "productId",
    sourceKey: "id",
    as: "basket",
  });
  ProductColor.hasMany(Basket, {
    foreignKey: "colorId",
    sourceKey: "id",
    as: "basket",
  });
  ProductSize.hasMany(Basket, {
    foreignKey: "sizeId",
    sourceKey: "id",
    as: "basket",
  });
  User.hasMany(Basket, {
    foreignKey: "userId",
    sourceKey: "id",
    as: "basket",
  });
  Discount.hasMany(Basket, {
    foreignKey: "basketId",
    sourceKey: "id",
    as: "basket",
  });

  Basket.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
    as: "product",
  });
  Basket.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });
  Basket.belongsTo(ProductColor, {
    foreignKey: "colorId",
    targetKey: "id",
    as: "color",
  });
  Basket.belongsTo(ProductSize, {
    foreignKey: "sizeId",
    targetKey: "id",
    as: "size",
  });
  Basket.belongsTo(Discount, {
    foreignKey: "discountId",
    targetKey: "id",
    as: "discount",
  });

  // یک سفارش می‌تواند شامل چندین آیتم (محصول) باشد.
  Order.hasMany(OrderItems, {
    foreignKey: "orderId",
    sourceKey: "id",
    as: "items",
  });
  OrderItems.belongsTo(Order, {
    foreignKey: "orderId",
    targetKey: "id",
    as: "orders",
  });

  // یک سفارش تنها می‌تواند یک پرداخت مرتبط با خود داشته باشد.
  Order.hasOne(Payment, {
    foreignKey: "orderId",
    sourceKey: "id",
    as: "payment",
  });
  Payment.belongsTo(Order, {
    foreignKey: "orderId",
    targetKey: "id",
    as: "order",
  });

  // یک کاربر می‌تواند چند سفارش داشته باشد.
  User.hasMany(Order, {
    foreignKey: "userId",
    sourceKey: "id",
    as: "orders",
  });

  // یک سفارش متعلق به یک کاربر است.
  Order.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });

  await sequelize.sync({ alter: true });
}

module.exports = initDatabase;
