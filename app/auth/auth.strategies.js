'use strict';

const {Strategy: LocalStrategy} = require('passport-local');

const {User} = require('../user');
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy((email, password, callback) => {
  let user; 
  
  User.findOne({email})
    .then(_user => {
      user = _user;

      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isvalid => {
      if (!isvalid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }

      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }

      return callback(err, false);
    });
});