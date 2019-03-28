const path = require('path');
const reauth = require('../middleware/reauth');  
const express = require('express');
const {check,body}  = require('express-validator/check');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',reauth,adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',[
    body('title','error title should have the characters of minimum 5 length').isAlpha().isLength({min:5}),
    body('description','the description should have the minimum length of 10 characters').isLength({min:10})
],reauth,adminController.postAddProduct);

router.get('/edit-product/:productId',reauth, adminController.getEditProduct);

router.post('/edit-product',[
    body('title','Please enter the characters of minimum 5 length').isAlpha().isLength({min:5}),
    body('description','Please enter the characters of minimum 10 length').isLength({min:10})
], adminController.postEditProduct);

router.post('/delete-product',reauth, adminController.postDeleteProduct);

module.exports = router;
