const cfg = require("./configs/cfg");
const { Client } = require('pg'); // Підключення до PostgreSQL
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const sequelize = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const rateLimit = require("express-rate-limit");
const ApiError = require("./error/ApiErrors");

const app = express();
const PORT = process.env.PORT || cfg.server.port || 7000;
const CLIENT_URL = process.env.CLIENT_URL || cfg.server.clientUrl;

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 10, // Ліміт запитів на 1 хвилину
  message: "Занадто багато запитів. Спробуйте знову через хвилину.",
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    next(ApiError.manyBadRequest(
      "Занадто багато запитів. Спробуйте знову через хвилину."
    ));
  },
});

// Логування запитів для дебагу
app.use((req, res, next) => {
  console.log(`Запит: ${req.method} ${req.url} від ${req.ip}`);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Застосовуємо ліміт для всіх маршрутів API
app.use("/api", apiLimiter);
app.use("/api", router);
// Кореневий маршрут
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is online!" }); 
});

// Глобальний обробник помилок
app.use(errorHandler);

const start = async () => {
  try {
    // 1. Підключаємося до PostgreSQL без зазначення бази даних
    const client = new Client({
      host: cfg.database.host,
      port: cfg.database.port,
      user: cfg.database.user,
      password: cfg.database.password,
    });

    console.log("Перевірка з'єднання з БД...");
    await client.connect();

    // 2. Перевіряємо, чи існує база даних
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = 'testTask'`
    );

    if (res.rowCount === 0) {
      // Якщо база даних не існує, створюємо її
      console.log('База даних не знайдена, створюємо...');
      await client.query(`CREATE DATABASE "testTask"`);
      console.log('База даних "testTask" створена!');
    }

    // Закриваємо тимчасове підключення до master бази
    await client.end();

    // 3. Тепер підключаємося до створеної бази даних через Sequelize
    sequelize.config.database = 'testTask'; // Вказуємо правильну базу даних у конфігурації

    console.log("Перевірка з'єднання з БД через Sequelize...");
    await sequelize.authenticate(); // Перевірка з'єднання через Sequelize
    console.log("Sequelize connection established successfully.");

    console.log("Синхронізація моделей...");
    await sequelize.sync({ force: false, alter: true });
    console.log("Database synchronized successfully.");

    // Запуск сервера після того, як все синхронізовано
    const PORT = cfg.server.port || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер працює на порту: ${PORT}`);
    });
  } catch (e) {
    console.error("Помилка при запуску сервера:", e.message);
  } finally {
    console.log("З'єднання з БД має бути закрите тільки після завершення роботи сервера.");
  }
};

// Викликаємо старт лише один раз
start();

module.exports = app;
