'use strict';

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');
const Joi = require('joi');

const {User, userJoiSchema} = require('./user.model');
const {HTTP_STATUS_CODES} = require('../config');

// Mount the router middleware
const router = express.Router();

// Import jwt authorization middleware
const {jwtAuth} = require('../auth');

// Create a New User
router.post('/', (req, res) => {

  // If the user doesn't select an avatar, assign a random index
  let randomAvatarIndex = Math.floor(Math.random()*30);

  let {username, password, name, displayName, avatar = randomAvatarIndex} = req.body;

  // ADD user data validation
  const validate = Joi.validate({
    name,
    displayName,
    username,
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

  User.find({username})
  .countDocuments()
  .then(count => {
    if (count > 0) {
      return Promise.reject({
        code: HTTP_STATUS_CODES.BAD_REQUEST,
        reason: 'ValidationError',
        message: 'Username already taken'
      });
    }
    return User.hashPassword(password);
  })
  .then(passwordHash => {
    return User.create({
      name,
      displayName,
      username,
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

// GET user by ID
router.get('/:id', jwtAuth, (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      return res.status(HTTP_STATUS_CODES.OK).json(user.serialize());
    })
    .catch(err => {
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.'
      });
    })
});

// PUT endpoint (JWT protected)

router.put('/:id', (req, res) => {
  if (!(req.params.id === req.body.id)) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      message: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'displayName', 'avatar'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  User.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
  .then(updatedUser => {
    return res.status(HTTP_STATUS_CODES.NO_CONTENT).json(updatedUser.serialize());
  })
  .catch(err => {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    })
  });
});

// DELETE enpoint (JWT protected)

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(err => {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({
        code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      })
    });
});

module.exports = {router};