const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const initializePassport = require('./Authentication/passportConfig');
const auth = require('./Authentication/auth');
const basicController = require('./Controllers/basicController');

const userRouter = require('./Routes/userRoutes');
const sortRouter = require('./Routes/sortRoutes');
const restaurantRouter = require('./Routes/restaurantRoutes');

const PORT = process.env.PORT || 8000;
console.log(`Db is ${process.env.DB_DATABASE}`);

app.set('view engine', 'ejs');

initializePassport(passport);

// Middlewares
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no value which we do not want to do
    saveUninitialized: false,
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

//Security
app.use(mongosanitize());
app.use(xss());
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many req from this IP, please try again later',
});
app.use('/', limiter);

//Basic Routes
app.get('/', basicController.sendIndex);
app.get('/home', auth.checkNotAuthenticated, basicController.home);
app.get('/form=:restname', basicController.restaurantSignup);

//Mounted Routers
app.use('/user', userRouter);
app.use('/sortBy', sortRouter);
app.use('/restaurant', restaurantRouter);

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
