const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order =require('../models/order');
const path = require('path');
const fs =require('fs');
const pdfDocument= require('pdfkit');
const Razorpay =require('razorpay');
// const config = require('../config/config');
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
var  page = +req.query.page;
 console.log(page);
  const ITEMS_PER_PAGE = 2 ; 
  var total_products ;
   Product.countDocuments().then(products=>{
    total_products  = products;
return   Product.find().skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
   }).then((val) => {
     /// console.log(val);
      res.render('shop/index', {
        prods: val,
        pageTitle: 'Shop',
        path: '/' ,
        isAuthenticated:req.session.isLogged,
        currentPage:page,
        hasNextPage:(ITEMS_PER_PAGE*page)<total_products,
        hasPrevPage:page>1,
        nextPage:page+1,
        prevPage:page-1,
        lastPage:Math.ceil(total_products/ITEMS_PER_PAGE)
      
      });
      console.log(+page);
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
 req.user.populate('cart.items.productId').execPopulate()
  .then(products=>{
 console.log(products.cart.items);
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
  var total_price= 0 ;
  var instance = new Razorpay({
    key_id: 'rzp_test_CnOSFhJTglS80m',
    key_secret: 'YOUR_KEY_SECRET',
  });
const payment_Id = req.body.paymentId;
  instance.payments.fetch(payment_Id).then(success=>{
    console.log(success);
  });
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
 console.log(total_price);
       
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
    let total_price= 0 ;
    let orderId ;
    let email ;
    let userId;
 orders.forEach(order=>{
  orderId = order._id;
email = order.user.email;
  order.products.forEach(p =>{
     total_price =total_price + p.product.price * p.quantity;
     userId = p.product.userId;
   })
 });
console.log(total_price , orderId ,email,userId);
   res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders,
        isAuthenticated:req.session.isLogged,
        total_price:total_price,
        orderId :orderId,
        email:email,
        userId :userId,
        // config:config
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

exports.getOrdersId =(req,res,next)=>{
 
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order=>{
    if(!order)
    {
      return next(new Error('Not able to find the file '));
    }

  else if(order.user.userId.toString() !== req.user._id.toString())
  {
    return next(new Error('Not able to find the file '));
  }
  const pdfkit =new pdfDocument();

  const orderName ='invoice'+'-'+orderId+'.pdf';
  res.setHeader('Content-Type','application/pdf');
  const orderPath = path.join('data','invoice',orderName);
  pdfkit.pipe(fs.createWriteStream(orderPath));
 pdfkit.image('./images/a.png',{
  // fit: [250, 300],
  align: 'center',
  valign: 'center'
 });
  pdfkit.pipe(res);
  let total_price= 0;
 pdfkit.fontSize('22').text('\n OrderId :\n' + orderId);
order.products.forEach(product=>{
  total_price = total_price+product.product.price;
  pdfkit.text('-------------------------------------------');
  
   pdfkit.fontSize('15').text('title of product: '+product.product.title);
   pdfkit.fontSize('15').text('product price: $'+product.product.price);

 
   
})
pdfkit.fontSize('20').text('total Price  :$'+total_price);
  pdfkit.end();

  }).catch(err=>{
    return next(err);
  })


}

exports.getCheckout = (req,res,next)=>{
  var email;
  var orderId;
  var userId;
return Order.find({'user.userId':req.user._id}).then(orders=>{

  orders.forEach(order=>{

orderId =order._id;

    order.products.forEach(p=>{
      userId = p.product.userId;
      
    })
  })
 var orderId1 =orderId[0];
  
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    let total = 0;
    products.forEach(p => {
      total += p.quantity * p.productId.price;
    });
    return res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products: products,
      total_price: total,
      orderId:orderId,
      email:'sdeven515@gmail.com',
      userId:userId,
      api_key:'ADD_YOUR_API_KEY',
      payment_id:userId.toString()
    });
  }).then(val=>{

   return req.user.clearCart();
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
  
})



}