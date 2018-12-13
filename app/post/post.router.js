'use strict'

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

const {User} = require('../user');
const {Post, postJoiSchema} = require('./post.model');
const {HTTP_STATUS_CODES} = require('../../config');

// Mount the router middleware
const router = express.Router();

// Import jwt authorization middleware
const {jwtAuth} = require('../auth');

// Create a New Note (JWT protected)
router.post('/', jwtAuth, (req, res) => {
  // Extract the received data from req.body
  let {title, distanceValue, distanceUnit, durationHours, durationMinutes, durationSeconds, runType, date, time, description, privacy, upvotes} = req.body;

  // Add post data validation
  const validate = Joi.validate({
    title,
    distanceValue,
    distanceUnit,
    durationHours,
    durationMinutes,
    durationSeconds,
    runType,
    date,
    time,
    description,
    privacy,
    user: req.user.id, // read directly from JWT payload
    upvotes
  }, postJoiSchema, {convert: false});

  if (validate.error) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      message: validate.error.details[0].message
    });
  }

  // Additional validation: Check if user ID's are in a valid ObjectID format

  // Check the 'user' property
  if (!(mongoose.Types.ObjectId.isValid(req.user.id))) {
    const message = 'The value of \'user\' is not in a valid ObjectId format.'
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      message: message
    });
  }

  // Check the 'upvotes' property
  if (upvotes) {
    console.log(upvotes[upvotes.length-1].userId);
    if (!(mongoose.Types.ObjectId.isValid(upvotes[upvotes.length-1].userId))) {
      const message = 'The value of \'upvotes\'/\'userId\' is not in a valid ObjectId format.'  
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        code: HTTP_STATUS_CODES.BAD_REQUEST,
        message: message
      });
    }
  }

  User.findById(req.user.id)
    .then(user => {
      if (user) {
        Post.create({
          title,
          distanceValue,
          distanceUnit,
          durationHours,
          durationMinutes,
          durationSeconds,
          runType,
          date,
          time,
          description,
          privacy,
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
      } else {
        const message = 'User not found.';
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: message
        });
      }
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
    .populate('user')
    .then(posts => {
      return res.status(HTTP_STATUS_CODES.OK).json(posts.map(post => post.serialize()))
    })
    .catch(err => {
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error'
      });
    })
});

// Retrieve a note by id, publicly accessible

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .populate('user')
  .then(post => {
    return res.status(HTTP_STATUS_CODES.OK).json(post.serialize());
  })
  .catch(err => {
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    });
  });
});

// Update a note (JWT protected)

router.put('/:id', jwtAuth, (req, res) => {
  if (!(req.params.id === req.body.id)) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      message: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['title', 'distanceValue', 'distanceUnit', 'durationHours', 'durationMinutes', 'durationSeconds', 'runType', 'date', 'time', 'description', 'privacy']; // TODO: add upvotes
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Post.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
  .populate('user')
  .then(updatedPost => {
    return res.status(HTTP_STATUS_CODES.NO_CONTENT).json(updatedPost.serialize());
  })
  .catch(err => {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error'
    });
  });
}); 

// Delete a note (JWT auth required)

router.delete('/:id', jwtAuth, (req, res) => {
  Post.findByIdAndRemove(req.params.id)
    .then(() => {
      return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(err => {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      });
    });
});

module.exports = {router};