const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./userModel"); // Імпорт моделі User
const Product = require("./productModel"); // Імпорт моделі Product

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Генерація UUID
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID, // Використовуємо UUID для зовнішнього ключа
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  productId: {
    type: DataTypes.UUID, // Використовуємо UUID для зовнішнього ключа
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Кількість повинна бути не меншою за 1
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0,
    get() {
      // Автоматичне обчислення вартості
      const quantity = this.getDataValue("quantity");
      const price = this.getDataValue("price");
      return quantity * price;
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Значення за замовчуванням - поточний час
  },
}, {
  timestamps: false, // Ми використовуємо власне поле createdAt
});

module.exports = Order;
