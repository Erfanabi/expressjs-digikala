const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize.config");

const Payment = sequelize.define(
  "payment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    amount: { type: DataTypes.DECIMAL },
    refId: { type: DataTypes.STRING, allowNull: true }, // پیگیری درگاه پرداخت بعد از رفتن به درگاه پرداخت
    authority: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { createdAt: "created_at", updatedAt: false, modelName: "payment" },
);

module.exports = {
  Payment,
};
