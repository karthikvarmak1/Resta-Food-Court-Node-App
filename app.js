var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require("crypto");

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var vendor = require('./routes/vendor') 
var order = require('./routes/order');

var cors = require('cors');

var app = express();
const PORT = process.env.PORT || 3000;

var http = require('http');
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'vendorimages')));

app.use(cors());

// app.use('/', index);
app.use('/users', users);
app.use('/register',register);
app.use('/vendor',vendor);
app.use('/order',order);

// const server = express()
// .use('/', index)
// .listen(PORT, () => console.log(`Listening on ${ PORT }`));

io.on('connection', (socket) => {
  console.log('yah !! socket is ready');

  socket.on('order-rejected', (data) => {
    console.log(data.msg);
    io.emit('order-rejected-client', {
      msg: data.msg
    });
  });
  
  socket.on('order-accepted', (data) => {
    console.log(data.msg);
    io.emit('order-accepted-client', {
      msg: data.msg
    });
  });

  socket.on('timer-completed', (data) => {
    console.log(data.msg);
    io.emit('timer-completed-client', {
      msg: data.msg
    });
  });

  socket.on('after-timecompleted-order', (data) => {
    console.log(data.msg);
    io.emit('after-timecompleted-order-client', {
      msg: data.msg
    });
  });

  socket.on('order-completed', (data) => {
    console.log(data.msg);
    io.emit('order-completed-client', {
      msg: data.msg
    });
  });

  socket.on('order-placed', (data) => {
    console.log(data.msg);
    io.emit('order-placed-client', {
      msg: data.msg
    });
  });

  socket.on('logged-in-user', (data) => {
    console.log(data.msg);
    io.emit('logged-in-user-client', {
      msg: data.msg
    });
  });

  socket.on('operation-type', (data) => {
    console.log(data.msg);
    io.emit('operation-type-client', {
      msg: data.msg
    });
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

server.listen(PORT, () => {
  console.log(`started on port: ` + app.get('port'));
});

module.exports = app;
