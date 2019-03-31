const path = require('path');
const csrf = require('csurf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const User = require('./models/user');
const flash = require('connect-flash');
const multer =require('multer');

const MONGODB_URI =
  'mongodb+srv://test123:jJQBtCPB801CoiWv@cluster0-w4lk4.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// app.use((err,req,res)=>{
//   console.log(err);
//   next();
// })

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination:function(req,callback){
    callback(null,'images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }

})
const filterImage = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/jpeg')
  {
    cb(null,true);
  }
  else{
  cb(null,false);
  }
}
// require('./routes/testtxn')(app);
// require('./routes/pgredirect')(app);
// require('./routes/response')(app)

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest:'images',filterImage:filterImage}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
app.use(csrfProtection);
app.use((error ,req,res,next)=>{
  console.log(error);
  next();
})
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI,{ useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });