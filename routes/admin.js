const path = require('path');
const reauth = require('../middleware/reauth');  
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',reauth,adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',reauth,adminController.postAddProduct);

router.get('/edit-product/:productId',reauth, adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product',reauth, adminController.postDeleteProduct);

module.exports = router;
