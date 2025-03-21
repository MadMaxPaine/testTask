const request = require("supertest");
const express = require("express");
const ApiError = require("../error/ApiErrors");
const errorHandlingMiddleware = require("../middleware/errorHandlingMiddleware");
const app = express();

// Створюємо тестовий маршрут для виклику помилок
app.use(express.json());
app.use("/test", (req, res) => {
  throw new ApiError(400, "This is a custom API error", []); // Викликаємо ApiError
});

// Використовуємо middleware для обробки помилок
app.use(errorHandlingMiddleware);

// Тест для обробки ApiError
describe("Error handling middleware", () => {
  it("should return correct error response for ApiError", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("This is a custom API error");
    expect(response.body.errors).toEqual([]); // Перевірка на порожній масив
  });

  it("should return correct response for unexpected errors", async () => {
    app.get("/unexpected", () => {
      throw new Error("Unexpected error");
    });

    const response = await request(app).get("/unexpected");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Unexpected error occurred!");
    expect(response.body.error).toBe("Unexpected error");
  });

  it("should not show error message in production", async () => {
    process.env.NODE_ENV = "production"; // Встановлюємо середовище на production

    app.get("/unexpected", () => {
      throw new Error("Unexpected error");
    });

    const response = await request(app).get("/unexpected");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Unexpected error occurred!");
    expect(response.body.error).toBeUndefined(); // Помилка не повинна бути видна в production
  });
});
