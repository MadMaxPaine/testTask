const ApiError = require("../error/ApiErrors");
const { Order, Product, User } = require("../models/index");
const { Op } = require("sequelize");
const sequelize = require("../db");

module.exports.create = async function create(req, res, next) {
    let transaction;
    
    try {
      console.log(req.body);
      const { userId, productId, quantity } = req.body;
  
      transaction = await sequelize.transaction(); // Починаємо транзакцію  
      // 1. Отримуємо користувача
      const user = await User.findOne({
        where: { id: userId },
        transaction,
      });
  
      if (!user) {
        await transaction.rollback();
        return next(ApiError.forbidden("Користувач не існує!"));
      }
  
      // 2. Отримуємо товар (product)
      const product = await Product.findOne({
        where: { id: productId },
        transaction,
      });
  
      if (!product) {
        await transaction.rollback();
        return next(ApiError.badRequest("Товар не існує!"));
      }
  
      // 3. Перевіряємо баланс користувача
      if (user.balance < quantity * product.price) {
        await transaction.rollback();
        return next(ApiError.forbidden("Недостатньо коштів!"));
      }
  
      // 4. Перевіряємо наявність товару
      if (product.stock < quantity) {
        await transaction.rollback();
        return next(ApiError.badRequest("Недостатньо товару на складі!"));
      }
  
      // 5. Знімаємо кошти з користувача
      user.balance -= quantity * product.price;
      await user.save({ transaction });
  
      // 6. Зменшуємо залишок товару
      product.stock -= quantity;
      await product.save({ transaction });
  
      // 7. Створюємо замовлення
      const order = await Order.create(
        {
          userId: user.id,
          productId: product.id,
          quantity,
          totalPrice: quantity * product.price,
        },
        { transaction }
      );
  
      // 8. Завершуємо транзакцію
      await transaction.commit();
  
      return res.json(order);
    } catch (e) {
      // У разі помилки відкочуємо транзакцію
      if (transaction) await transaction.rollback();
      next(ApiError.forbidden(e.message)); // Передаємо помилку далі
    }
};

  

module.exports.getAllForUser = async function getAllForUser(req, res, next) {
  try {    
    const userId = req.params.id;    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    console.log(userId);
    const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            attributes: ["id", "name", "price", "stock"],
          },
        ],
      });
      
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found for this user" });
      }      
          // Перетворюємо результат в масив об'єктів з лише необхідними полями
    const ordersList = orders.map(order => ({
        id: order.id,
        userId: order.userId,
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.quantity * order.product.price, // Рахуємо загальну суму
        createdAt: order.createdAt,
        user: {
          name: order.user.name,
          email: order.user.email,
        },
        product: {
          name: order.product.name,
          price: order.product.price,
        },
      }));
  
      // Повертаємо список замовлень у відповідь     
      
    return res.status(200).json(ordersList);
  } catch (error) {
    console.error("Error retrieving orders for user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
