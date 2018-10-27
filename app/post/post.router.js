'use strict'

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');
const Joi = require('joi');

const {User} = require('../user');
const {Post, postJoiSchema} = require('./post.model');
const {HTTP_STATUS_CODES} = require('../config');

// Mount the router middleware
const router = express.Router();

// Create a New Note (JWT protected)
router.post('/', (req, res) => {
  // Extract the received data from req.body
  let {distance, runTime, dateTime, user, upvotes} = req.body;

  // Add post data validation
  const validate = Joi.validate({
    distance,
    runTime,
    dateTime,
    user,
    upvotes
  }, postJoiSchema, {convert: false});

  if (validate.error) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      CODE: HTTP_STATUS_CODES.BAD_REQUEST,
      reason: validate.error.name,
      message: validate.error.details[0].message
    });
  }

  Post.create({
    distance,
    runTime,
    dateTime,
    user,
    upvotes
  })
  .then(post => {
    return res.status(HTTP_STATUS_CODES.CREATED).json(post.serialize());
  })
  .catch(err => {
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    });
  });
});

// Retrieve all existing notes (publicly accessible)

router.get('/', (req, res) => {
  Post.find()
    .populate()
    .then(posts => {
      return res.status(HTTP_STATUS_CODES.OK).json(posts.map(post => post.serialize()))
    })
    .catch(err => {
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error'
      });
    })
})

module.exports = {router};