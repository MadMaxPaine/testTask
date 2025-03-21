const orderController = require('../controllers/orderController');
const Router = require("express");
const router = new Router();

router.post("/",orderController.create);
router.get("/:id",orderController.getAllForUser);

module.exports = router;