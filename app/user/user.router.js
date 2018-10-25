'use strict';

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');

const {User} = require('./user.model');
const {HTTP_STATUS_CODES} = require('../config');

// Mount the router middleware
const router = express.Router();

// Create a New User
router.post('/', (req, res) => {

  // ADD USER DATA VALIDATION HERE!!

  let {email, password, name, displayName, avatar} = req.body;

  User.find({email})
  .count()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: HTTP_STATUS_CODES.BAD_REQUEST,
        reason: 'ValidationError',
        message: 'Email already taken',
        location: 'email' 
      });
    }
    return User.hashPassword(password);
  })
  .then(passwordHash => {
    User.create({
      name,
      displayName,
      email,
      password: passwordHash,
      avatar
    });
  })
  .then(user => {
      return res.status(HTTP_STATUS_CODES.CREATED).json(user.serialize());
  })
  .catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error'});
  });
});

module.exports = {router};