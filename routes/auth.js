const express =require('express');
const auth = require('../controllers/auth');
const {check,body}   = require('express-validator/check');
const User = require('../models/user');
const router =express.Router();
router.get('/login',auth.getlogin);
router.post('/login',auth.postlogin);
router.post('/logout',auth.postlogout);

router.get('/signup',auth.getSignup);

router.post(
    '/signup',
    [
      check('email')
        .isEmail().normalizeEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          // if (value === 'test@test.com') {
          //   throw new Error('This email address if forbidden.');
          // }
          // return true;
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        }),
      body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
      ).trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
      body('confirmPassword').isAlphanumeric().trim().custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
    ],
    auth.postSignup
  );
  


router.get('/reset',auth.getreset);
router.get('/reset/:token',auth.getNewPass);
router.post('/reset',auth.postReset);
router.post('/newPass',auth.postnewPass);

module.exports = router;