const { create, getAllForUser,} = require('../services/orderService');
class BrandController {
 constructor() {
  this.create = create;
  this.getAllForUser = getAllForUser;
 }
}

module.exports = new BrandController();