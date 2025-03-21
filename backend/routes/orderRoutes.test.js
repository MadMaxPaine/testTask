const request = require('supertest');
const app = require('../index'); // твій Express сервер
const { User, Product, Order } = require('../models');
const sequelize =require("../db");
beforeAll(async () => {
    await sequelize.sync({ force: true }); // Очистити БД перед тестами
});

describe('Order API Tests', () => {
    
    test('❌ Відхилити замовлення при недостатньому балансі', async () => {
        const user = await User.create({ name: 'Test User', balance: 20 });
        const product = await Product.create({ name: 'Test Product', price: 50, stock: 10 });

        const response = await request(app)
            .post('/api/orders')
            .send({ userId: user.id, productId: product.id, quantity: 1 });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Недостатньо коштів!');
    });

    test('✅ Успішне створення замовлення', async () => {
        const user = await User.create({ name: 'Valid User', balance: 200 });
        const product = await Product.create({ name: 'Available Product', price: 50, stock: 10 });

        const response = await request(app)
            .post('/api/orders')
            .send({ userId: user.id, productId: product.id, quantity: 2 });

        expect(response.status).toBe(200);
        expect(response.body.totalPrice).toBe(100);
    });

});
