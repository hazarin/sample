const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/server/config/config.json')[env];

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const mailer = require('express-mailer');

const index = require('./routes/index');
const login = require('./routes/login');
const logout = require('./routes/logout');
const membership = require('./routes/membership');
const register_success = require('./routes/register_success');

const models = require('./server/models');

const User = models.User;

const app = express();

mailer.extend(app, config.mailer);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'adailyclock secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.set('User', User);
app.set('Passport', passport);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.passport = passport;
  res.locals.User = User;
  res.locals.mailer = app.mailer;
  res.locals.app = app;
  next();
});

// var Router = require('named-routes');
// var router = new Router();
// router.extendExpress(app);
// router.registerAppHelpers(app);

app.use('/', index);
app.use('/membership', membership);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register/success', register_success);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
