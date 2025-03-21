const { Sequelize } = require("sequelize");
const cfg = require("./configs/cfg");

const sequelize = new Sequelize(cfg.database.name, cfg.database.user, cfg.database.password, {
  dialect: cfg.database.dialect, 
  host: cfg.database.host,
  port: cfg.database.port,
  logging: false, 
});

module.exports = sequelize;