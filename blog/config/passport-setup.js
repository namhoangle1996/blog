const passport = require('passport');
const keys     = require('./keys');

const User = require('../model/user-model');

const GoogleStrategy = require('passport-google-oauth20');

// ma hoa thong tin



passport.use(
   
     new GoogleStrategy({
         callbackURL: '/auth/google/redirect',
         clientID: keys.google.clientID,
         clientSecret : keys.google.clientSecret
     }, function (accessToken, refreshToken, profile , done) {
     	// body...
     	// console.log(profile);
     	console.log('passport call back function here');


        User.findOne({googleId : profile.id}).then(function(currentUser){
            console.log(profile);
        	if (currentUser) {
        		console.log('User is: ', currentUser);
        		done(null, currentUser);
        	} else {
        		new User({
        			username: profile.displayName,
                    googleId: profile.id,
                    avatar  : profile._json.image.url,
        		}).save().then(function(newUser){

        			console.log('New User created !' + newUser);
        			done(null, newUser);
        		});

        	}
        });
           

     })
	)

	passport.serializeUser((user,done) => {
		console.log("User Ne:",user)
		done(null, user._id);
	})
	
	// giai ma thong tin
	
	passport.deserializeUser(function(id,done) {
		console.log("id Ne:",id)
		User.findById(id).then(function(user){
			console.log(id)
			done(null, user);
		})
	})