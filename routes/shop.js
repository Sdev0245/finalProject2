const path = require('path');

const express = require('express');
const reauth = require('../middleware/reauth');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

  router.get('/products/:productId', shopController.getProduct);
 
router.get('/cart', reauth,shopController.getCart);

router.post('/cart',reauth,shopController.postCart);

router.post('/cart-delete-item',reauth, shopController.postCartDeleteProduct);

router.post('/create-order',reauth,reauth,shopController.postOrder);
router.get('/checkout',reauth,shopController.getCheckout);

router.post('/delete-order',shopController.deleteOrder);

router.get('/orders',reauth,shopController.getOrders);
router.get('/orders/:orderId',reauth,shopController.getOrdersId);
// router.get('/checkout', shopController.getCheckout);

module.exports = router;
