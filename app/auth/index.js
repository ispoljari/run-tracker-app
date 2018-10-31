'use strict';

const {router} = require('./auth.router');
const {localStrategy, localAuth} = require('./auth.strategies');

module.exports = {router, localStrategy, localAuth};