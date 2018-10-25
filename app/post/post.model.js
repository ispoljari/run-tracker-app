'use strict';

// Import 3rd party frameworks and libraries 

const mongoose = require('mongoose');
const Joi = require('joi');

mongoose.Promise = global.Promise;

// Import the User model to enable referencing from post.user
const {User} = require('../user');

const Schema = mongoose.Schema;

const postSchema = Schema({
  distance: {type: Number},
  runTime: {type: Number},
  dateTime: {type: Date, default: Date.now},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  upvotes: {type: Number, default: 0}
});

// Setup populate in middleware
postSchema.pre('find', function(next) {
  this.populate('User');
  next();
});

// Add a serialize instance method to filter return data
postSchema.methods.serialize = function() {
  return {
    distance: this.distance,
    runTime: this.runTime,
    dateTime: this.dateTime,
    upvotes: this.upvotes,
    user: this.user.serialize()
  };
};

// Create a Joi schema for post data validation
const postJoiSchema = Joi.object().keys({
  distance: Joi.number().required(),
  runTime: Joi.number().required(),
  dateTime: Joi.date().optional(),
  upvotes: Joi.number().optional(),
  user: Joi.string().required()
});

const Post = mongoose.model('Post', postSchema);

module.exports = {Post, postJoiSchema};
