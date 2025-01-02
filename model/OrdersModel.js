const {model} = require('mongoose');

const {OrdersSchema} = require('../schemas/OrdersSchema');

const OrdersModel = new model('holding', OrdersSchema);

module.exports = {OrdersModel};