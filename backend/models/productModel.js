const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Генерація UUID
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0, // Перевірка на невід'ємне значення
    },
  },
}, {
  timestamps: true,
});

module.exports = Product;
