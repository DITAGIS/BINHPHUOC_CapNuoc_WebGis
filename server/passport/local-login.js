const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../../config');
const User = require('../models/user');


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {
  const userData = {
    username: username.trim(),
    password: password.trim()
  };
  // find a user by email address
  return User.findById(userData.username)
    .then(user => {
      if (!user) {
        const error = new Error('Không đúng tài khoản khoặc mật khẩu');
        error.name = 'Không xác thực';

        return done(error);
      }

      // check if a hashed user's password is equal to a value saved in the database
      return User.comparePassword(userData.password, user.Password, (passwordErr, isMatch) => {
        if (passwordErr) { return done(passwordErr); }

        if (!isMatch) {
          const error = new Error('Không đúng tài khoản hoặc mật khẩu');
          error.name = 'Không xác thực';

          return done(error);
        }

        const payload = {
          sub: user._id
        };

        // create a token string
        const token = jwt.sign(payload, config.jwtSecret);
        const data = {
          ...user
        };

        return done(null, token, data);
      });
      // if (userData.password == user.Password) {
      //   const payload = {
      //     sub: user._id
      //   };

      //   // create a token string
      //   const token = jwt.sign(payload, config.jwtSecret);
      //   const data = {
      //     name: user.name
      //   };

      //   return done(null, token, data);
      // } else {
      //   const error = new Error('Không đúng tài khoản hoặc mật khẩu');
      //   error.name = 'Không xác thực';

      //   return done(error);
      // }
    })
    .catch(err => done(err));
});
