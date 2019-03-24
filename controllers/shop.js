const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order =require('../models/order');
//const orderItem =require('../models/orderItem');
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((val) => {
      res.render('shop/product-list', {
        prods: val,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated:req.session.isLogged,
       
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {

   const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
        isAuthenticated:req.session.isLogged
    });
  })
  .catch(err => console.log(err));
   
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((val) => {
     /// console.log(val);
      res.render('shop/index', {
        prods: val,
        pageTitle: 'Shop',
        path: '/' ,
        isAuthenticated:req.session.isLogged,
      
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
 req.user.populate('cart.items.productId').execPopulate()
  .then(products=>{
 // console.log(products.cart.items);
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products.cart.items,
    
        isAuthenticated:req.session.isLogged
  })
 }).catch(err=>{
   console.log(err);
})

 }

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId).then(product=>{

    return req.user.addToCart(product);
  }).then(result=>{
            res.redirect('/cart');
  }).catch(err=>{
    console.log(err);
  });
  // let newQuantity =1;
  // let fetchedCart ;
  // req.user.getCart().then(cart=>{
  //    fetchedCart =cart;     
  //   return cart.getProducts({where:{id:prodId}});
  // }).then(products=>{
  
  //   let product;
  //    if(products.length>0)
  //    {
  //      product = products[0];

  //    }
  //    if(product)
  //    {
  //      newQuantity = product.cartItem.quantity+1;
  //      return  Product.findById(prodId) ;
  //    }
     
  //    return  Product.findById(prodId);
  //    }).then(product=>{
  //   return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});

  //    }).then(val=>{

  //     res.redirect('/cart');
  //    }).then(val=>{
  //   res.redirect('/cart');
  // }).catch(err=>{
  //   console.log(err);
  // })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

        
       req.user.deleteItem(prodId).then(Cart=>{
         res.redirect('/cart')

      //    return Cart.getProducts({where:{id:prodId}})
      //  }).then(product=>{
         
      //   return product[0].cartItem.destroy();

      //  }).then(val=>{
      //   req.user.getOrder().then(order=>{
      //    return order.getProduct({where:{id:prodId}}).then(val=>{
      //       val[0].orderItem.destroy();
      //     }).then(e=>{
      //       res.redirect('/cart');
      //     })
      //   })

      
      //    console.log(val);
      //  }).catch(err=>{
      //    console.log(err);
       })
};


exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));



//  let fetchedCart;
//   req.user
//   .getCart().then(Cart=>{
//     fetchedCart=Cart;
//      return Cart.getProducts();
//   }).then(products=>{


  
  
//     req.user.createOrder().then(order=>{
//   return  order.addProducts(products.map(product=>{
//      product.orderItem  = {quantity:product.cartItem.quantity};
//      console.log(product);
//        return product;
//     })).catch(err=>{
//   console.log(err);
//     })
      
//     });
//   }).then(val=>{
//     fetchedCart.setProducts(null);
//     res.redirect('/orders');
//   }).catch(err=>{
//     console.log(err);
//   })

};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id}).then(orders=>{
   res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders,
        isAuthenticated:req.session.isLogged
    });
   // console.log(order[0].products[0]);
  }).catch(err=>{
    console.log(err);
  })
}
  //  .getOrders({include:['products']}).then(orders=>{
  // //  console.log(orders[0].products[0].orderItem);
  //   res.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders:orders
  //   });
      

exports.deleteOrder=  (req,res,next) =>{
     const orderId = req.body.orderId;
   Order.findByIdAndRemove(orderId).then(values=>{
     res.redirect('/orders')
   }).catch(err=>{
     console.log(err);
   })
}
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
        isAuthenticated:req.session.isLogged
  });
};
