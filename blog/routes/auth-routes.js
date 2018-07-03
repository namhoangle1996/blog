var express = require('express');
var router = express.Router();

const passport = require('passport');
router.use(passport.initialize());
// app.use(passport.initialize());

router.get('/home', function(req,res) {
	res.render('home.ejs',{user : req.user});
})

router.get('/login', function(req,res){

	res.render('login.ejs',{user: req.user});
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
	res.redirect('/profile');

})


module.exports = router;