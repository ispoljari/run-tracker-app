const {loginRouter} = require('./auth.router');
const {localStrategy} = require('./auth.strategies');

module.exports = {loginRouter, localStrategy};