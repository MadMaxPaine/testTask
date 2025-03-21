const ApiError = require('../error/ApiErrors'); // шляхи можуть змінюватися в залежності від вашої структури проекту

describe('ApiError', () => {
  it('should create a badRequest error with status 400 and correct message', () => {
    const error = ApiError.badRequest('This is a bad request');
    expect(error.status).toBe(400);
    expect(error.message).toBe('This is a bad request');
    expect(error.errors).toEqual([]);  // Перевіряємо, чи є порожній масив помилок за замовчуванням
  });

  it('should create a forbidden error with status 403 and correct message', () => {
    const error = ApiError.forbidden('This is forbidden');
    expect(error.status).toBe(403);
    expect(error.message).toBe('This is forbidden');
    expect(error.errors).toEqual([]);  // Перевіряємо, чи є порожній масив помилок за замовчуванням
  });

  it('should create a manyBadRequest error with status 429 and custom message', () => {
    const error = ApiError.manyBadRequest('Too many requests!');
    expect(error.status).toBe(429);
    expect(error.message).toBe('Too many requests!Too many requests!');
    expect(error.errors).toEqual([]);  // Перевіряємо порожній масив помилок
  });

  it('should create a notFound error with status 404 and default message', () => {
    const error = ApiError.notFound();
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.errors).toEqual([]);  // Перевіряємо, чи є порожній масив помилок за замовчуванням
  });

  it('should create an internal error with status 500 and correct message', () => {
    const error = ApiError.internal('Internal server error');
    expect(error.status).toBe(500);
    expect(error.message).toBe('Internal server error');
    expect(error.errors).toEqual([]);  // Перевіряємо порожній масив помилок
  });

  it('should create a badRequest error with custom errors array', () => {
    const error = ApiError.badRequest('Bad request', ['Missing parameter']);
    expect(error.status).toBe(400);
    expect(error.message).toBe('Bad request');
    expect(error.errors).toEqual(['Missing parameter']);
  });
});
