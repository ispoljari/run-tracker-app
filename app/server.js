'use strict';

// Import 3rd party frameworks, libraries and/or config parameters
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, TEST_DATABASE_URL, PORT, HTTP_STATUS_CODES} = require('./config');

// Initialize an express app
const app = express();

// Setup logging of the HTTP layer
app.use(morgan('combined'));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  if(req.method === 'OPTIONS') {
    return res.send(204);
  }

  next();
});


// Serve static assets to client
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.json());

// Import router modules
const {router: usersRouter} = require('./user');

// Route handlers for the /api/users/ endpoint
// Used to POST a new user to the DB, not protected
app.use('/api/users', usersRouter);

// Run the server
if (require.main === module) {
  app.listen(PORT || 8080, ()=> {
    console.info(`The server started listening at port ${process.env.PORT || 8080}`);
  });
}

module.exports = {app};