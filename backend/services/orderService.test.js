const request = require('supertest');
const app = require('../index'); // Шлях до вашого файлу з додатком
const { User, Product } = require('../models');

let user, product;

beforeAll(async () => {
  user = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    balance: 100,
  });

  product = await Product.create({
    name: "Test Product",
    price: 10,
    stock: 100,
  });
});

afterAll(async () => {
  await User.destroy({ where: { id: user.id } });
  await Product.destroy({ where: { id: product.id } });
});

describe('POST /api/orders', () => {

  it('should create an order successfully', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: user.id,
        productId: product.id,
        quantity: 5,
      });

    expect(response.status).toBe(200); // Перевірка правильного створення замовлення
    expect(response.body).toHaveProperty('userId', user.id);
    expect(response.body).toHaveProperty('productId', product.id);
    expect(response.body).toHaveProperty('quantity', 5);
    expect(response.body).toHaveProperty('totalPrice', 50);
  });

  it('should return an error if user does not exist', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: 'non-existing-id',
        productId: product.id,
        quantity: 5,
      });

    expect(response.status).toBe(403); // Перевірка коду помилки для неіснуючого користувача
    expect(response.body.message).toBe("Користувач не існує!");
  });

  it('should return an error if product does not exist', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: user.id,
        productId: 'non-existing-id',
        quantity: 5,
      });

    expect(response.status).toBe(400); // Перевірка помилки для неіснуючого товару
    expect(response.body.message).toBe("Товар не існує!");
  });

  it('should return an error if insufficient balance', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: user.id,
        productId: product.id,
        quantity: 200, // Більше ніж користувач може собі дозволити
      });

    expect(response.status).toBe(403); // Перевірка помилки через недостатній баланс
    expect(response.body.message).toBe("Недостатньо коштів!");
  });

  it('should return an error if insufficient stock', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: user.id,
        productId: product.id,
        quantity: 200, // Більше ніж на складі
      });

    expect(response.status).toBe(400); // Перевірка помилки через недостатній товар на складі
    expect(response.body.message).toBe("Недостатньо товару на складі!");
  });
});
