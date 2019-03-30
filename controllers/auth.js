const User =require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {validationResult} = require('express-validator/check');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter =nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'ADD_YOUR_API_KEY'
    }
}));
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
            req.flash('error','User doesnt Exists!');
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
        req.flash('error','Wrong password ');
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
      const err = validationResult(req);
   
      if(!err.isEmpty())
      {
         return res.status(422).render('auth/signup',{
            path:'signup',
            pageTitle:'SignUp',
            isAuthenticated:false,
            errMessage:err.array()[0],
            oldInput:{
                email:email,
                password:password,
                confirmPassword:req.body.confirmPassword
            }
             
        })
      }
     bcrypt
     .hash(password,12)
     .then(password=>{
        const user = new User({
            email:email,
            password:password,
            items:{
                cart:[]
            }
        });
        return user.save();
      }).then(user=>{
        return  transporter.sendMail({
             to:email,
             from:'node@node.com',
             subject:'Regarding the Succesful SignUp',
             html:'<h1> You have been Successfully registered to the Shopping website of NIT Hamirpur Stay tuned for further </h1>'
         })
        
     }).then(val=>{
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
        errMessage:message,
        oldInput:{
            email:"",
            password:"",
            confirmPassword:""
        }
    
         
    })
}
exports.getreset = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length>0)
    message =message[0];
    else
    message =null;
    res.render('auth/reset',{
        path:'reset',
        pageTitle:'SignUp',
        isAuthenticated:false,
        errMessage:message
         
    })
}

exports.postReset =(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
      if(err)
      {
          req.flash('error','Not able to resume');
          res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({email:req.body.email}).then(user=>{
          if(!user)
          {
              req.error('error','No such user');
              return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now()+360000;
         return user.save().then(user=>{
            transporter.sendMail({
                to:req.body.email,
                from:'shop@node.com',
                subject:'Regarding the password reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
              `
            })
            

         })
         

      }).catch(err=>{
        req.flash('error','No such user');
          res.redirect('/reset');
      })
    })
    
}

exports.getNewPass  = (req,res,next)=>{
    const token = req.params.token;
    // let message = req.flash('error');
    // if(message.length>0)
    // message =message[0];
    // else
    // message =null;
    // res.render('auth/signup',{
    //     path:'signup',
    //     pageTitle:'SignUp',
    //     isAuthenticated:false,
    //     errMessage:message
         
    // })
    User.findOne({resetToken:token , resetTokenExpiration:{$gt:Date.now()}}).then(user=>{
let message = req.flash('error');
    if(message.length>0)
    message =message[0];
    else
    message =null;
    res.render('auth/newPass',{
        path:'/newPass',
        pageTitle:'setNewPass',
        isAuthenticated:false,
        errMessage:message,
        userId:user._id.toString(),
        passtoken:token
         
    })
    }).catch(err=>{
    res.redirect('/reset');
    })
}

exports.postnewPass =(req,res,next)=>{
    const userId = req.body.userId;
    const token = req.body.passtoken;
    let newuser;
    User.findOne({resetToken:token,_id:userId,resetTokenExpiration:{$gt:Date.now()}}).then(user=>{
       console.log(user);
        newuser =user;
      return  bcrypt.hash(req.body.password,12)
     
     
    }).then(hashed=>{
        newuser.password = hashed;
        newuser.resetToken =undefined;
        newuser.resetTokenExpiration =undefined;
        return newuser.save()
    }).then(val=>{
        res.redirect('/login')
    }).catch(err=>{
        console.log(err);
        req.flash('error','error found');
        res.redirect('/reset');
    })
}