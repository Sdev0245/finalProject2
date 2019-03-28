const Product = require('../models/product');
const {validationResult} = require('express-validator/check');
const mongodb = require('mongodb');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errMessage:null
   
  });
};

exports.postAddProduct = (req, res, next) => {
  const error =  validationResult(req);
  console.log(error.array());
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 
  const product =new Product({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description,
    userId:req.user
  });
  if(!error.isEmpty())
  {
    return  res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      errMessage:error.array()[0],
      product:product
     
    });
  }
  product.save().then(product=>{
 res.redirect('/products');
  }).catch(err=>{
    console.log(err);
  })
//  Product.create({
//     title:title,
//     imageUrl:imageUrl,
//     price:price,
//     description:description,
//     userId:req.user.id
//   }).then(val=>{
//     res.redirect('/');
//   }).catch(err=>{
//     console.log(err);
//   })



// const product = new Product(title,price,imageUrl,description,null,req.user._id);
// product
// .save()
// .then(values=>{
//   res.redirect('/admin/products');
//   console.log(values);
// }).catch(err=>{
//   console.log(err);
// })
 
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated:req.session.isLogged,
        errMessage:null
      });
    })
    .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  //const product =new Product(updatedTitle,updatedPrice,updatedImageUrl,updatedDesc,prodId);
  
Product.findById({_id:prodId,userId:req.user._id}).then(product=>{

  product.title = updatedTitle;

  product.price = updatedPrice;
  product.imageUrl = updatedImageUrl;
  product.description = updatedDesc;
  const error  = validationResult(req);
console.log(error.array());
  if(!error.isEmpty())
  {
   return  res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      errMessage:error.array()[0].msg,
      product : product
     
    });
  }

  product.save();
  res.redirect('/products');
}).catch(err=>{
  res.redirect('/');
  console.log(err);
})
};

exports.getProducts = (req, res, next) => {
 Product.find({userId:req.user._id}).then(products=>{
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    isAuthenticated:req.session.isLogged
  })
 }).catch(err=>{
   res.redirect('/');
   console.log(err);
 })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId).then(product=>{
    res.redirect('/admin/products')
  }).catch(err=>{

  console.log(err);
  })
}