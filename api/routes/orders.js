const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const e = require('express');
const orderController = require('../controllers/ordersController')

router.get('/', checkAuth, orderController.orders_get_All );

router.post('/', checkAuth, orderController.create_order);

router.get('/:orderId', checkAuth, orderController.get_individual_order);

router.delete('/:orderId', checkAuth, orderController.delete_specific_order);

module.exports = router;