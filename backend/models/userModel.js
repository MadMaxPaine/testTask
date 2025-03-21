const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Генерація UUID
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL,
      defaultValue: 100,
    },
  }, {
    timestamps: true,
  });

  module.exports = User;