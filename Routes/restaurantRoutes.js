const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const restaurantController = require('./../Controllers/restaurantController');
const auth = require('./../Authentication/auth');

const router = express.Router();

router
  .route('/')
  .get(auth.checkNotAuthenticated, restaurantController.restaurants);

router
  .route('/auth')
  .get(restaurantController.getRestaurantSignup)
  .post(urlencodedParser, restaurantController.postRestaurant);

router
  .route('/Update=:restname')
  .post(urlencodedParser, restaurantController.updateRestaurant);
router
  .route('/cartItems')
  .post(auth.checkNotAuthenticated, restaurantController.cartItems);
router.route('/ratingUpdate').post(restaurantController.ratingUpdate);
router.route('/orderDetails').get(auth.checkNotAuthenticated, restaurantController.orderDetails);
module.exports = router;
