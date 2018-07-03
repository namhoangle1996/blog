var express = require('express');
var router = express.Router();
// var expressValidator = require('express-validator');
// router.use(expressValidator());

// var user =require('../model/user');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('userIndex.handlebars',{ title: 'User Index'});
// });  ok

// router.get('/register', function(req, res, next) {
//   res.render('register.handlebars',{ title: 'Register'});
// });

// router.get('/login', function(req, res, next) {
//   res.render('login.handlebars',{ title: 'Login'});
// });

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
//      var newUser = new User ({
//        name : name,
//        username : username,
//        email : email,
//        password : password,
//      });
//      User.createUser(newUser,funnction({
//       if (err) {
//         throw err;
//       }
//      }))
//    }
   

// });


module.exports = router;
