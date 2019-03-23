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
const session = require('express-session');
const mongoose =require('mongoose');
const app = express();

const mongodb = require('mongodb');
app.set('view engine', 'ejs');
app.set('views', 'views');

const MongoDbStore = require('connect-mongodb-session')(session);
const store = new MongoDbStore({
    uri:'mongodb+srv://test123:jJQBtCPB801CoiWv@cluster0-w4lk4.mongodb.net/shop',
    collection:'sessions'
});
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
}))
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const auth = require('./routes/auth');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    if(!req.session.user)
     return next();
    User.findById(req.session.user.id)
    .then(user=>{
       console.log(user);
     
       req.user = user;
       next();
    }).catch(err=>{
        console.log(err);
    })
});
app.use('/admin', adminRoutes);
 app.use(shopRoutes);
 app.use(auth);
//  app.use((req,res,next)=>{
//      User.findById('5c8e3ab559b8002d4c32c4dc').then(user=>{
//          req.session.user = user;
//          req.user =user

//      }).catch(err=>{
//          console.log(err);
//      })
//  })
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