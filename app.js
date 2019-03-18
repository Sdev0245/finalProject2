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
//const mongoConnect= require('./util/database').mongoConnect;
const mongoose =require('mongoose');
const app = express();
const mongodb = require('mongodb');
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use((req,res,next)=>{
    User.findById('5c8e3ab559b8002d4c32c4dc')
    .then(user=>{
       
        req.user =user;
   // console.log(req.user);
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


mongoose.connect('mongodb+srv://test123:jJQBtCPB801CoiWv@cluster0-w4lk4.mongodb.net/shop?retryWrites=true',{ useNewUrlParser: true }).then(data=>{
//console.log(data); 

User.findOne().then(user=>{
    if(!user)
    {
        const user = new User({
            name:'test123',
            email:'test@test.com'
        })
        user.save();
    }
      
})
app.listen(3000);

}).catch(err=>{
    console.log(err);
})