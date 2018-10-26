'use strict';

// Import 3rd party libraries and frameworks
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

/*  ------ Create the user schema
-> The 'require' validator is not used in the user schema, because validation is not done at the dabatase layer, but at the nodejs/server layer with a 3rd party validation framework called Joi) */

const userSchema = Schema({
  name: String,
  displayName: String,
  email: {
    type: String,
    unique: true /* Ensure that this field is unique (no duplicates) in the DB */
  },
  password: String,
  avatar: Number
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    displayName: this.displayName,
    avatar: this.avatar
  };
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Create a Joi schema for user data validation
const userJoiSchema = Joi.object().keys({
  name: Joi.string().min(1).trim().required(),
  displayName: Joi.string().min(1).trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(10).max(72).trim().required(),
  avatar: Joi.number().integer()
});

const User = mongoose.model('User', userSchema);

module.exports = {User, userJoiSchema};