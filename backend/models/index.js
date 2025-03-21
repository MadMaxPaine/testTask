const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = require("./userModel");
const Order = require("./orderModel");
const Product = require("./productModel");

// Встановлюємо зв'язки між моделями
  User.hasMany(Order, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Order.belongsTo(User, {
    foreignKey: "userId",
  });
  
  Product.hasMany(Order, {
    foreignKey: "productId",
    onDelete: "CASCADE",
  });
  Order.belongsTo(Product, {
    foreignKey: "productId",
  });

module.exports = {
    User,
    Order,
    Product,
};
  