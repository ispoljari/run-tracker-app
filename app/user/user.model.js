'use strict';

// Import 3rd party libraries and frameworks
const mongoose = require('mongoose');
// const Joi = require('joi');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Create the user schema
const userSchema = Schema({
  name: {type: String, required: true},
  displayName: {type: String, required: true},
  email: {
    type: String, 
    required: true,
    unique: true},
  password: {type: String, required: true},
  avatar: {type: Number, required: true}
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

// // Create a Joi schema for user data validation
// const userJoiSchema = Joi.object().keys({
//   name: Joi.string().min(1).trim().required(),
//   email: Joi.string().email().trim().required(),

// });

const User = mongoose.model('User', userSchema);

module.exports = {User};