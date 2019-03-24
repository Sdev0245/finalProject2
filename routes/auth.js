const express =require('express');
const auth = require('../controllers/auth');
const router =express.Router();
router.get('/login',auth.getlogin);
router.post('/login',auth.postlogin);
router.post('/logout',auth.postlogout);

router.get('/signup',auth.getSignup);
router.post('/signup',auth.postSignup);
module.exports = router;