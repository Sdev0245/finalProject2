const express =require('express');
const auth = require('../controllers/auth');
const router =express.Router();
router.get('/login',auth.getlogin);
router.post('/login',auth.postlogin);
router.post('/logout',auth.postlogout);
module.exports = router;