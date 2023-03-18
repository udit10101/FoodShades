const express = require('express');
const auth = require('./../Authentication/auth');
const passport = require('passport');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const userController = require('./../Controllers/userController');

const router = express.Router();

router
  .route('/register')
  .get(auth.checkAuthenticated, userController.register)
  .post(userController.postUser);

router
  .route('/login')
  .get(auth.checkAuthenticated, userController.login)
  .post(
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/user/login',
      failureFlash: true,
    })
  );
router.route('/logout').get(auth.checkNotAuthenticated, userController.logout);
router
  .route('/account')
  .get(auth.checkNotAuthenticated, userController.account);
router
  .route('/updateInfo')
  .post(
    auth.checkNotAuthenticated,
    urlencodedParser,
    userController.updateInfo
  );
router
  .route('/updatePassword')
  .post(
    auth.checkNotAuthenticated,
    urlencodedParser,
    userController.updatePassword
  );
router
  .route('/pastOrders')
  .get(auth.checkNotAuthenticated, userController.pastOrders);

module.exports = router;
