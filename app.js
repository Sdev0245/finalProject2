const path = require('path');
// const Order = require('./models/order');
// const OrderItem =  require('./models/orderItem');
const express = require('express');
const bodyParser = require('body-parser');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cartItem');
const errorController = require('./controllers/error');
const User = require('./models/user');
const Product = require('./models/product');
// const cart = require('./models/cart');
const mongoConnect= require('./util/database').mongoConnect;
const app = express();
const mongodb = require('mongodb');
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use((req,res,next)=>{
    User.findById('5c8662ba7984db1999cba1e5')
    .then(user=>{
       
        req.user =new User(user.username,user.email,user.cart,user._id);
        ///console.log(req.user);
       next();
    }).catch(err=>{
        console.log(err);
    })
});
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
 app.use(shopRoutes);
mongoConnect(()=>{

    app.listen(3000);
});

