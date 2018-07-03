var express = require('express');
var jade = require('jade');
var router = express.Router();
const {URL} = require('url');
const GoogleStrategy = require('passport-google-oauth20');
var contactModel = require('../model/contact.js');
var aboutModel   = require('../model/about.js');
var indexModel   = require('../model/index.js');
var adminModell = require('../model/admin.js');
var userModel = require('../model/user-model.js')
var mongoose = mongoose;
// var user   = require('../model/user.js');
var sample_postModel = require('../model/sample_post.js');
var User = require('../model/user-model');
var pseudoArray = ['admin']; 
var io = require("socket.io");
const app = express();

const notifier = require('node-notifier');
// String
notifier.notify('Message');

// Object
notifier.notify({
  title: 'Hello Nam',
  message: 'Have good day !'
});
var http = require('http')
, server = http.createServer(app)
, io = require('socket.io').listen(server);



const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var pagination = require('pagination'); 
var multer = require('multer');
var paginationMiddleware = require("express-pagination-middleware");
var gulp = require('gulp');
var randomColor = require('randomcolor');
var flash = require('connect-flash');
var flashPlus = require('connect-flash-plus');
// var session = require('express-session');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcryptjs');    //ma hoa mat khau //
var passport = require('passport');   // authen login//
router.use(passport.initialize());

// var LocalStrategy = require('passport-local').Strategy;  //authen login //
// var expressValidator = require('express-validator'); //validate body //
// router.use(expressValidator());
// router.use(flash());
// router.use(session({  
//   secret: 'secret',
//   resave: false, 
//   saveUninitialized: false}));
//    router.use(function(req,res,next){
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg   = req.flash('errot_msg');
//     res.locals.error       = req.flash('error');
//     next();
//   });

//   var paginator = pagination.create('search', {prelink:'/', current: 1, rowsPerPage: 500, totalResult: 10});
// console.log(paginator.render());

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     user.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// phan HIEN THI

// router.get('/login_index', function(req, res, next) {
//   // user.find( {}, function(err,giatri){
//   res.render('userIndex.handlebars',{ title: 'User Index'});
// // })
// });
// router.get('/register', function(req, res, next) {
//   // user.find( {}, function(err,giatri){
//     res.render('register.handlebars', { title: 'Home page',data: giatri });
// //  })
//   // res.redirect('/login');
// });
// router.post('/register', function(req, res, next) {
//   var kq= {
//     'username': req.body.username,
//     'password': req.body.password,
//     'email' : req.body.email,
//     'name' : req.body.name
//   }
//   var giatri= new userModel(kq);
//   giatri.save();
//   // res.redirect('/login');
// });


/* GET login page. */

// router.get('/login', function(req, res, next) {
//   user.find( {}, function(err,giatri){
//   res.render('login.handlebars',{ title: 'Login'});
//   })
// });




router.get('/home', function(req, res, next) {
  res.render('home.ejs', {user: req.user});
});
router.get('/login', function(req,res){

	res.render('login.ejs',{user: req.user});
});

const authCheck = (req, res, next) => {
	if(!req.user){
		res.redirect('/auth/login');

	} else {
		next();
	}
}

router.get('/profile', function(req,res){
	res.render('profile.ejs', {user : req.user});
});

router.get('/logout', function(req,res){

	req.logout();
	res.redirect('/');
});
router.get('/google',passport.authenticate('google',{
	scope : ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), function(req,res){

	// res.send(req.user);
 
  // res.render('profile.ejs', {user : req.user});
  // res.redirect('/profile/', );

})



/* GET home page. */
router.get('/', function(req, res, next) {
  indexModel.find( {}, function(err,giatri){
    res.render('index.ejs', { data: giatri });
 }).sort({ created: 'desc' })
 
});

router.get('/about', function(req, res, next) {
  aboutModel.find( {}, function(err,giatri){
    res.render('about.ejs', { title: 'About',data: giatri });
 })
});


router.get('/sample_post', function(req, res, next) {
  sample_postModel.find( {}, function(err,giatri){
    res.render('sample_post.ejs', { title: 'Sample_post_page',data: giatri });
 })
});

router.get('/contact', function(req, res, next) {
  contactModel.find( {}, function(err,giatri){
    res.render('contact.handlebars', { title: 'Contact page',data: giatri });
 })
});

router.get('/admin/index-admin', function(req, res, next) {
  indexModel.find( {}, function(err,giatri){
    res.render('admin/admin/detail.ejs', { title: 'Xem du lieu trang index',data: giatri });
 }).sort({ created: 'desc' })
});




// phan ADMIN  ( xem, them, xoa, sua)
//trang Index    Xem
router.get('/admin/index', function(req, res, next) {
  indexModel.find( {}, function(err,giatri){
    res.render('admin/index/detail.ejs', { title: 'Xem du lieu trang index',data: giatri });
 }).sort({ created: 'desc' })
});

// add  Them
router.get('/admin/index/add', function(req, res, next) {
  res.render('admin/index/add.ejs', { title: 'them du lieu' });
});
router.get('/add', function(req, res, next) {
  res.render('add.ejs', { title: 'them du lieu' });
});
router.post('/addbaiviet/', function(req, res, next) {
  var kq= {
    'tieudelon': req.body.tieudelon,
    'tieudenho': req.body.tieudenho,
    'trangthai': req.body.trangthai,
    'link'     : req.body.link,
    'theloai'  : req.body.theloai,
  }
  var giatri= new indexModel(kq);
  giatri.save();
  res.redirect('/admin/index');
});


router.get('/chitietbaiviet', function(req, res, next) {
  res.render('chitietbaiviet.ejs', {user: req.user});
});

router.post('/admin/index/addd/', function(req, res, next) {
  var kq= {
    'tieudelon': req.body.tieudelon,
    'tieudenho': req.body.tieudenho,
    'trangthai': req.body.trangthai,
    'link'     : req.body.link,
    'theloai'  : req.body.theloai,
  }
  var giatri= new indexModel(kq);
  giatri.save();
  res.redirect('/admin/index');
});
//Add

router.post('/chitietbaiviet/', function(req, res, next) {
  var kq= {
    'noidungcomment': req.body.noidungcomment,
    'tieudenho': req.body.tieudenho,
    'trangthai': req.body.trangthai,
    'link'     : req.body.link,
    'theloai'  : req.body.theloai,
  }
  var giatri= new indexModel(kq);
  giatri.save();
  res.redirect('/admin/index');
});

//Xoa   Xoa
router.get('/admin/index/xoa/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa;
  indexModel.findByIdAndRemove(id).exec();
  res.redirect('/admin/index');
});
//Xoa

//    Sua
router.get('/admin/index/edit/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  indexModel.find({_id: id},function(err,giatri){
    res.render('admin/index/edit.ejs',{title:'Trang Edit',data:giatri});
    
  })
});
//Sua dulieu (post){lay ve gia tri tu form ben view}
router.post('/admin/index/edit/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  indexModel.findById(id).exec(function(err,giatri){
    if (err) return handleError(err);
    giatri.tieudelon = req.body.tieudelon;
    giatri.tieudenho = req.body.tieudenho;
    giatri.trangthai = req.body.trangthai;
    giatri.link      = req.body.link;
    giatri.theloai   = req.body.theloai;
    giatri.save();
    res.redirect('/admin/index');
  });
});

router.get('/chitietbaiviet/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  indexModel.find({_id: id},function(err,giatri){
    res.render('chitietbaiviet.ejs',{title:'Trang Edit',data:giatri, user: req.user});
    
  })
});
//Sua dulieu (post){lay ve gia tri tu form ben view}
router.post('/chitietbaiviet/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  indexModel.findById(id).exec(function(err,giatri){
    if (err) return handleError(err);
    giatri.tieudelon = req.body.tieudelon;
    giatri.tieudenho = req.body.tieudenho;
    giatri.trangthai = req.body.trangthai;
    giatri.link      = req.body.link;
    giatri.theloai   = req.body.theloai;
    giatri.save();
    res.redirect('/chitietbaiviet');
  });
});


// send Mail
router.post('/send',function(req,res,next) {

console.log(req.body);
const output = `
<h1> Thông báo contact từ blog của bạn </h1>
<h3> Chi tiết : </h3> 
<ul>
  <li>Name: ${req.body.name}  </li>    
  <li>Email: ${req.body.email}  </li>    
  <li>Phone number: ${req.body.phone_number}  </li>      
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
    to: 'namhoangle1996@gmail.com ', // list of receivers
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
    res.render('contact.handlebars',{msg:'Email has been sent'});

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
})

// end send mail

// het Admin trang index

//phan admin trang abput
router.get('/admin/about', function(req, res, next) {
  aboutModel.find( {}, function(err,giatri){
    res.render('admin/about/detail.ejs', { title: 'Xem du lieu trang index',data: giatri });
 })
});

// add  Them
router.get('/admin/about/add', function(req, res, next) {
  res.render('admin/about/add.ejs', { title: 'them du lieu' });
});

router.post('/admin/about/add/', function(req, res, next) {
  var kq= {
    'noidung': req.body.noidung,
  }
  var giatri= new aboutModel(kq);
  giatri.save();
  res.redirect('/admin/about');
});
//Add

router.get('/admin/about/xoa/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa;
  aboutModel.findByIdAndRemove(id).exec();
  res.redirect('/admin/about');
});

//    Sua
router.get('/admin/about/edit/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  aboutModel.find({_id: id},function(err,giatri){
    res.render('admin/about/edit.ejs',{title:'Trang Edit',data:giatri});
    
  })
});
//Sua dulieu (post){lay ve gia tri tu form ben view}
router.post('/admin/about/edit/:idcanxoa', function(req, res, next) {
  var id = req.params.idcanxoa; 
  aboutModel.findById(id).exec(function(err,giatri){
    if (err) return handleError(err);
    giatri.noidung = req.body.noidung;

    giatri.save();
    res.redirect('/admin/about');
  });
});

router.get('/chat', function(req, res){
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




//het admin trang contact

// post trang register
// router.post('/register', function(req,res,next){
//    var name      = req.body.name;
//    var username  = req.body.username;
//    var email     = req.body.email;
//    var password  = req.body.password;
//    var password2 = req.body.password;

//    console.log(name);
//    req.checkBody('password2','Passwords is not match').equals(req.body.password);

//    var errors = req.validationErrors();
//    if (errors) {
//      res.render('register',{
//        errors : errors
//      });
//    }
//    else { 
//      console.log('Good pass!~');
//      var kq= {
//       'username': req.body.username,
//       'password': req.body.password,
//       'email' : req.body.email,
//       'name' : req.body.name
//     };
//       bcrypt.genSalt(10, function(err, salt) {
//           bcrypt.hash("giatri.password", salt, function(err, hash) {
//               // Store hash in your password DB. 
//               giatri.password = hash;
//               giatri.save();
//           });
//       });
//     var giatri= new userModel(kq);
//     giatri.save();
//     req.flash('success_msg','Dang ki thanh cong, ban hay dang nhap vao nhe !');
//     // passport.authenticate('local')(req, res, function () {
//       res.redirect('/login');
//     // });
//    }
// });

// passport.use(new LocalStrategy(
//   function(username,password,done) {
//     //  User.getUserByUsername(username, function(err,user){
//     //     if(err) throw err;
//     //     if(!user) {
//     //       return done(null, false, {message:'Unknown user'});
//     //     }
//   //    User.comparePassword(password, user.password, function(err,isMatch){
//   //           if(err) throw err;
//   //           if(isMatch) {
//   //             return done(null,user);
//   //           } 
//   //           else { return done(null, false, {message:'Wrong password or user'}) };
//   //         });
//   //     });
//   }
// ));

// passport.serializeUser(function(user,done){
//   done(null,user.id);
// });

// passport.deserializeUser(function(id,done){
//     User.getUserById(id,function(err,user){
//       done(err,user);
//     });
// });

// post trang login 
// router.post('/login',
// passport.authenticate('local', { successRedirect: '/', failureRedirect: '/', failureFlash : true }),
//   function(req,res) {
//        res.redirect('/');
//   },
//   function(candidatePassword, hash , callback){
//     bcrypt.compare(candidatePassword, hash , function(err, isMatch){
//         //    if(err) throw err;
//            callback(null, isMatch);
//     });
// },
// function(id,callback) {
//   User.findById(id,callback);
// },
// function(username,callback) {
//   var querry = {username: username};
//   User.findOne(querry, callback);
// }
//  );

module.exports = router;
