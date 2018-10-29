'use strict';

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');
const Joi = require('joi');

const {User, userJoiSchema} = require('./user.model');
const {HTTP_STATUS_CODES} = require('../config');

// Mount the router middleware
const router = express.Router();

// Create a New User
router.post('/', (req, res) => {

  // If the user doesn't select an avatar, assign a random index
  let randomAvatarIndex = Math.floor(Math.random()*30);

  let {email, password, name, displayName, avatar = randomAvatarIndex} = req.body;

  // ADD user data validation
  const validate = Joi.validate({
    name,
    displayName,
    email,
    password,
    avatar
  }, userJoiSchema, {convert: false});

  if (validate.error) {

    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      reason: validate.error.name,
      message: validate.error.details[0].message
    });
  }

  User.find({email})
  .countDocuments()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: HTTP_STATUS_CODES.BAD_REQUEST,
        reason: 'ValidationError',
        message: 'Email already taken'
      });
    }
    return User.hashPassword(password);
  })
  .then(passwordHash => {
    return User.create({
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
      return res.status(err.code).json({
        code: err.code,
        message: err.message
      });
    }

    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    });
  });
});

// PUT endpoint (protected)

module.exports = {router};