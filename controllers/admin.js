const Product = require('../models/product');
const {validationResult} = require('express-validator/check');
const filehelper = require('../util/filehelper')
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
  console.log('++++++++',error.array());
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(image);
  if(!error.isEmpty())
  {
    return  res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      errMessage:error.array()[0].msg,
      product:{
        product :{
          title:title,
          imageUrl:image,
          price:price,
          description:description,
          userId:req.user
      
         }
      }
     
    });
  }
 
 if(!image)
 {
  return  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: true,
    errMessage:'Please select a proper image of png or jpg or jpeg format',
  
    product :{
      title:title,
      imageUrl:undefined,
      price:price,
      description:description,
      userId:req.user
  
     }
  });
 }
 const imageUrl = image.path;
 const product =new Product({
  title:title,
  imageUrl:imageUrl,
  price:price,
  description:description,
  userId:req.user
});
  
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
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;
  //const product =new Product(updatedTitle,updatedPrice,updatedImageUrl,updatedDesc,prodId);
 
Product.findById({_id:prodId,userId:req.user._id}).then(product=>{

  product.title = updatedTitle;

  product.price = updatedPrice;
  product.imageUrl = updatedImageUrl;
  product.description = updatedDesc;
  if(!updatedImageUrl)
  {
    return  res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      errMessage:'Upload an image with jpeg or png or jpg',
      product : product
     
    });
  }
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

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findByIdAndRemove(prodId).then(product=>{

     // console.log('removed',product);
      return filehelper.deleteFile(product.imageUrl);
   
  }).then(()=>{

res.status(200).json({message:
"Success"
})
  }).catch(err=>{

  console.log(err);
  })
}