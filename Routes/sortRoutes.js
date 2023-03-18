const express = require('express');
const auth = require('./../Authentication/auth');
const passport = require('passport');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const sortController = require('./../Controllers/sortController');

const router = express.Router();

router
  .route('/VegOnly')
  .get(auth.checkNotAuthenticated, sortController.vegOnly);
router
  .route('/Rating')
  .get(auth.checkNotAuthenticated, sortController.ratings);
router
  .route('/DeliveryTime')
  .get(auth.checkNotAuthenticated, sortController.deliveryTime);
router
  .route('/Category=:dish')
  .get(auth.checkNotAuthenticated, sortController.category);


module.exports=router;
