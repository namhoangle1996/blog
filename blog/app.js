var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// session để cao nhất ưu tiên
var session = require('express-session');
var mongoose = require('mongoose'); 
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var pagination = require('pagination');
var multer = require('multer');
var paginationMiddleware = require("express-pagination-middleware");
var expressValidator = require('express-validator');
var passport = require('passport');
var passportLocal = require('passport-local');
var flash = require('connect-flash');
var flashPlus = require('connect-flash-plus');
var cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');
const notifier = require('node-notifier');
var debug = require('debug')('blog:server');
var pseudoArray = ['admin'];
var http=require('http');

var server=http.createServer(function(req,res){
    res.end('test');
});

server.on('listening',function(){
    console.log('ok, server is running');
});

// server.listen(3000);
notifier.notify('Message');
notifier.on('click', function(notifierObject, options) {
  // Triggers if `wait: true` and user clicks notification
  res.redirect('/admin/index');
  console.log('OOOOOO');

});

// Object
notifier.notify({
  title: 'Hello',
  message: 'Hello, Nam!'
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRoutes = require('./routes/profile-routers');
var authRoutes    = require('./routes/auth-routes');

var passportSetup = require('./config/passport-setup');
var keys = require('./config/keys');
// const passport = require('passport');
mongoose.connect('mongodb://localhost/blog');
mongoose.connect(keys.mongodb.mongoURI, function(err) {
  if(err) console.log('database is feild');
  else console.log('database is connected');
});
var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
io = require('socket.io').listen(server);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 
console.log(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs());
app.set('view engine', 'ejs');
app.set('view engine', 'handlebars');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session dưới cookieParser
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))
//passport dưới session 
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
// app.use(cookieSession({
// 	maxAge : 24*60%60*1000,
// 	keys : [keys.session.cookieKey]
// }));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error.ejs');
});

app.use(expressValidator());
app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while ( namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg: msg,
      value: value,
    };
  }
}));

// app.use(flash());

// app.use(function(req,res,next){
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg   = req.flash('errot_msg');
//   res.locals.error       = req.flash('error');
//   next();
// });

// app.use(session({
// secret : 'secret',
// saveUninitialized : true,
// resave : true
// }));


// app.use(expressValidator());



// router.get('/', function(req, res, next) {
//   res.render('userIndex.handlebars',{ title: 'User Index'});
// });

app.get('/home',(req, res) =>{
  res.render('home.ejs', {user: req.user});
})
app.get('/',(req,res)=>{
  res.render('index.ejs',{user: req.user});
})

app.get('/contact',(req,res)=>{
  res.render('contact.handlebars');
});
app.get('/chat', function(req, res){
  res.render('chat.jade');
});
var users = 0; //count the users

io.sockets.on('connection', function (socket) { // First connection
	users += 1; // Add 1 to the count
	reloadUsers(); // Send the count to all the users
	socket.on('message', function (data) { // Broadcast the message to all
		if(pseudoSet(socket))
		{
			var transmit = {date : new Date().toISOString(), pseudo : socket.nickname, message : data};
			socket.broadcast.emit('message', transmit);
			console.log("user "+ transmit['pseudo'] +" said \""+data+"\"");
		}
	});
	socket.on('setPseudo', function (data) { // Assign a name to the user
		if (pseudoArray.indexOf(data) == -1) // Test if the name is already taken
		{
			pseudoArray.push(data);
			socket.nickname = data;
			socket.emit('pseudoStatus', 'ok');
			console.log("user " + data + " connected");
		}
		else
		{
			socket.emit('pseudoStatus', 'error') // Send the error
		}
	});
	socket.on('disconnect', function () { // Disconnection of the client
		users -= 1;
		reloadUsers();
		if (pseudoSet(socket))
		{
			console.log("disconnect...");
			var pseudo;
			pseudo = socket.nickname;
			var index = pseudoArray.indexOf(pseudo);
			pseudo.slice(index - 1, 1);
		}
	});
});

function reloadUsers() { // Send the count of the users to all
	io.sockets.emit('nbUsers', {"nb": users});
}
function pseudoSet(socket) { // Test if the user has a name
	var test;
	if (socket.nickname == null ) test = false;
	else test = true;
	return test;
}




app.post('/send',(req,res)=>{
  console.log(req.body);
  const output = `
  <h1> Thông báo liên hệ từ blog của bạn ! </h1>
  <h3> Chi tiết liên hệ </h3> 
  <ul>
    <li>Name: ${req.body.name}  </li>    
    <li>Company: ${req.body.email}  </li>    
    <li>Gmail: ${req.body.phone_number}  </li>    
  </ul>
   
  <h3> Mesages</h3>
  <p> ${req.body.message} </p> 
  
  `;
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'happybear02042000@gmail.com', // generated ethereal user
          pass: '@Nam12345' // generated ethereal password
      },
      tls: {rejectUnauthorized:false}
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Fred Foo 👻"', // sender address
      to: 'happybear02042000@gmail.com', // list of receivers
      subject: 'Hello Nam lê ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('index.ejs',{msg:'Email has been sent'});

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
  res.render('index.ejs');
})
// end gmail sendMail

module.exports = app;
