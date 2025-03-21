const ApiError = require("../error/ApiErrors");

module.exports = function (err, req, res, next) {
    // Якщо це помилка ApiError, повертаємо відповідь з відповідним статусом і повідомленням
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors || null,
        });
    }
    // Обробка неочікуваних помилок
    return res.status(500).json({
        message: "Unexpected error occurred!",
        error: process.env.NODE_ENV === "production" ? null : err.message, // Відображаємо помилку тільки в девелоперському середовищі
    });
};
