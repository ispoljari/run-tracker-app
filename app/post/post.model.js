'use strict';

// Import 3rd party frameworks and libraries 

const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.Promise = global.Promise;

// Import the User model to enable referencing from post.user
const {User} = require('../user');

const Schema = mongoose.Schema;

const upvoteSchema = Schema({
  userId: String
});

const postSchema = Schema({
  distance: Number,
  runTime: Number,
  dateTime: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  upvotes: [upvoteSchema]
});

// Setup populate in middleware
postSchema.pre('find', function(next) {
  this.populate('User');
  next();
});

// Add a serialize instance method to filter return data
postSchema.methods.serialize = function() {
  let user;

  if (typeof this.user.serialize === 'function') {
    user = this.user.serialize();
  } else {
    user = this.user;
  }

  return {
    id: this._id,
    distance: this.distance,
    runTime: this.runTime,
    dateTime: this.dateTime,
    upvotes: this.upvotes,
    user: user
  };
};

// Create a Joi schema for post data validation
const postJoiSchema = Joi.object().keys({
  distance: Joi.number().required(),
  runTime: Joi.number().required(),
  dateTime: Joi.string().optional(),
  user: Joi.string().required(),
  upvotes: Joi.array().items(
    Joi.object().keys({
      userId: Joi.string().optional(),
    })  
  )
});

const Post = mongoose.model('Post', postSchema);

module.exports = {Post, postJoiSchema};
