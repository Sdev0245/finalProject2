const User =require('../models/user');
exports.getlogin  = (req,res,next )=>{
res.render('auth/login',{
    pageTitle:'login',
    path:'/login',
    isAuthenticated:false

});

}
exports.postlogin = (req,res,next)=>{
// const options ={
//     httpOnly:true
// }
    //req.setHeader('Set-Cookie','isLogged =true',options);
    User.findById('5c8e3ab559b8002d4c32c4dc').then(user=>{
        req.session.user =user;
        req.session.isLogged =true;
        req.session.save(user=>{
            console.log(user);
            res.redirect('/');
        })
    });

   
   
}

exports.postlogout =(req,res,next)=>{
//   console.log(req.session);
//req.session.isLogged =false;
    req.session.destroy(()=>{
        //console.log('+++++++',user);
        res.redirect('/');
    })
   
}