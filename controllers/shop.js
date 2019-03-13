const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order =require('../models/order');
const orderItem =require('../models/orderItem');
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((val) => {
      res.render('shop/product-list', {
        prods: val,
        pageTitle: 'All Products',
        path: '/products'
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
      path: '/products'
    });
  })
  .catch(err => console.log(err));
   
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((val) => {
     /// console.log(val);
      res.render('shop/index', {
        prods: val,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
 req.user.getCart()
  .then(products=>{
   console.log(products);
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products
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


exports.postOrder = (req,res,next)=>{
  req.user.addOrder().then(orders=>{
    res.redirect('/orders');
  }).catch(err=>{
    console.log(err);
  })

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
   req.user
   .getOrders().then(order=>{
        res.render('shop/orders', {
         path: '/orders',
      pageTitle: 'Your Orders',
      order:order
    });
   })
  //  .getOrders({include:['products']}).then(orders=>{
  // //  console.log(orders[0].products[0].orderItem);
  //   res.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders:orders
  //   });
      
  //  })
};
exports.deleteOrder=  (req,res,next) =>{
     const orderId = req.body.orderId;
  req.user.deleteOrder(orderId).then(orders =>{
       res.redirect('/orders');
  }).catch(err=>{
    console.log(err);
  })
  
}
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
