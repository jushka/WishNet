const LocalStrategy = require("passport-local").Strategy,
      bcrypt = require("bcryptjs"),
      User = require("../models/user");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      // match user
      User.findOne({
        email: email
      }).then((user) => {
        if(!user) {
          return done(null, false, {message: "No user registered with such email"});
        }
        
        // match password
        bcrypt.compare(password, user.password, (err, passwordsMatch) => {
          if(err) {
            throw err;
          }
          if(!passwordsMatch) {
            return done(null, false, {message: "Password incorrect"});
          } else {
            return done(null, user);
          }
        });
      });
    })
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};