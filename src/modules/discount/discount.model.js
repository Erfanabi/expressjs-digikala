const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize.config");

const Discount = sequelize.define(
  "discount",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: true },
    code: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("basket", "product") },
    amount: { type: DataTypes.INTEGER },
    percent: { type: DataTypes.INTEGER },
    limit: { type: DataTypes.INTEGER, allowNull: true }, // 50 نفر
    usage: { type: DataTypes.INTEGER, allowNull: true },
    expires_in: { type: DataTypes.DATE, allowNull: true }, // اتمام جشنواره
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    modelName: "discount",
  },
);

module.exports = {
  Discount,
};
