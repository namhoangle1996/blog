var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
	if(!req.user){
		res.redirect('/auth/login');

	} else {
		next();
	}
}

router.get('/home', function(req,res){
	console.log(req.user);
	res.render('profile.ejs', {user : req.user});
});

module.exports = router;