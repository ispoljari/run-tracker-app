'use strict';

const {router} = require('./auth.router');
const {localStrategy, jwtStrategy, localAuth, jwtAuth} = require('./auth.strategies');

module.exports = {router, localStrategy, localAuth, jwtStrategy, jwtAuth};