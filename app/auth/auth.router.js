'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const router = express.Router();

const {localAuth, jwtAuth} = require('./auth.strategies');

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
}

// Login with correct username/password
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  return res.json({authToken});
});

// Refresh JWT after expiry date
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({authToken});
});


module.exports = {router};