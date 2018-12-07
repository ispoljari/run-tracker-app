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
  title: String,
  distanceValue: Number,
  distanceUnit: String,
  durationHours: Number,
  durationMinutes: Number,
  durationSeconds: Number,
  runType: String,
  date: String,
  time: String,
  description: String,
  privacy: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  upvotes: [upvoteSchema]
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
    title: this.title,
    distanceValue: this.distanceValue,
    distanceUnit: this.distanceUnit,
    durationHours: this.durationHours,
    durationMinutes: this.durationMinutes,
    durationSeconds: this.durationSeconds,
    runType: this.runType,
    date: this.date,
    time: this.time,
    description: this.description,
    privacy: this.privacy,
    upvotes: this.upvotes,
    user: user
  };
};

// Create a Joi schema for post data validation
const postJoiSchema = Joi.object().keys({
  title: Joi.string().required(),
  distanceValue: Joi.number().required(),
  distanceUnit: Joi.string().required(),
  durationHours: Joi.number().required(),
  durationMinutes: Joi.number().required(),
  durationSeconds: Joi.number().required(),
  runType: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  description: Joi.string().required(),
  privacy: Joi.string().required(),
  user: Joi.string().required(),
  upvotes: Joi.array().items(
    Joi.object().keys({
      userId: Joi.string().optional(),
    })  
  )
});

const Post = mongoose.model('Post', postSchema);

module.exports = {Post, postJoiSchema};
