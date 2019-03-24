const User =require('../models/user');
const bcrypt = require('bcryptjs')
exports.getlogin  = (req,res,next )=>{

    let message = req.flash('error');
    if(message.length>0)
    message =message[0];
    else
    message =null;
res.render('auth/login',{
    pageTitle:'login',
    path:'/login',
    isAuthenticated:false,
    errMessage:message
   

});

}
exports.postlogin = (req,res,next)=>{
// const options ={
//     httpOnly:true
// }
    //req.setHeader('Set-Cookie','isLogged =true',options);
    const email = req.body.email;
    const pass = req.body.password;
    
    User.findOne({email:email}).then(user=>{
        if(!user)
        {
            req.flash('error','User already Exists!');
            return res.redirect('/signup');
        }
     
        bcrypt.compare(pass,user.password).then(match=>{
            if(match) 
            {
            req.session.user =user;
            req.session.isLogged =true;
            return req.session.save(user=>{
                console.log(user);
                res.redirect('/');
            });
        }
        req.flash('error','Wrong password or Email');
        res.redirect('/login');

        }).catch(err=>{

            return res.redirect('/login');
        })
      
        })


   
   
}

exports.postlogout =(req,res,next)=>{
//   console.log(req.session);
//req.session.isLogged =false;
    req.session.destroy(()=>{
        //console.log('+++++++',user);
        res.redirect('/');
    })
   
}

exports.postSignup = (req,res,next)=>{
      const email  =req.body.email;
      const  password = req.body.password;
      const confirmPassword = req.body.password;
      return bcrypt.hash(password,12).then(password=>{
        User.findOne({email:email}).then(userDoc=>{
            if(userDoc)
            {
                return res.render('/signup')
            }
        const user = new User({
            email:email,
            password:password,
            items:{
                cart:[]
            }
        });
        return user.save();
      });
     }).then(value=>{
         res.redirect('/login');
     }).catch(err=>{
    console.log(err);
     })
}

exports.getSignup = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length>0)
    message =message[0];
    else
    message =null;
    res.render('auth/signup',{
        path:'signup',
        pageTitle:'SignUp',
        isAuthenticated:false,
        errMessage:message
         
    })
}