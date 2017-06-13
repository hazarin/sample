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

const FileStore = require('session-file-store')(expressSession);

const index = require('./routes/index');
const login = require('./routes/login');
const logout = require('./routes/logout');
const membership = require('./routes/membership');
const register_success = require('./routes/register_success');

const models = require('./server/models');

const User = models.User;

const app = express();
//Swagger doc
const sw = express();


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
  // store: new FileStore,
  secret: 'adailyclock secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge  : new Date(Date.now() + 7200000), //2 Hour
    expires : new Date(Date.now() + 7200000), //2 Hour
  },
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.set('config', config);
app.set('config', config);
app.set('User', User);
app.set('Passport', passport);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', app.get('config').frontend.uri);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, OPTIONS, DELETE');
  res.header('Allow', 'GET, HEAD, POST, PATCH, OPTIONS, DELETE');
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.passport = passport;
  res.locals.User = User;
  res.locals.mailer = app.mailer;
  res.locals.app = app;
  next();
});

app.use('/v1', sw);
const swagger = require('swagger-node-express').createNew(sw);
swagger.setApiInfo(config.api_info);
app.use('/api/doc', express.static(path.join(__dirname, 'server/doc')))


// Local backend routes
app.use('/', index);
app.use('/membership', membership);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register/success', register_success);

//REST Api end point
require('./server/routes')(app);

//REST Api doc endpoint
app.get('/api/doc', function (req, res, next) {
  res.sendFile(__dirname + '/server/doc/index.html');
});
swagger.configureSwaggerPaths('', 'api/doc', '');

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
