'use strict';

// Import 3rd party frameworks and libraries 

const mongoose = require('mongoose');
const {User} = require('../user');

mongoose.Promise = global.Promise;

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
  this.populate('user');
  next();
});

// Add a serialize instance method to filter return data
postSchema.methods.serialize = function() {
  return {
    distance: this.distance,
    runTime: this.runTime,
    dateTime: this.dateTime,
    upvotes: this.upvotes,
    userName: this.user.name,
    userDisplayName: this.user.displayName,
    userAvatar: this.user.avatar
  };
};

// Add validation with Joi
// -----------

const Post = mongoose.model('Post');

module.exports = {Post};
