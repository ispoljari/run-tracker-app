'use strict';
require('dotenv').config();
 
// Import 3rd party frameworks, libraries and/or config parameters

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, TEST_DATABASE_URL, PORT, HTTP_STATUS_CODES} = require('./config');

// Initialize an express app
const app = express();

// Setup logging of the HTTP layer
app.use(morgan('combined'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  if(req.method === 'OPTIONS') {
    return res.send(204);
  }

  next();
});

// Serve static assets to client
app.use(express.static(path.join(__dirname, '/app/public')));

// Import router modules
const {router: usersRouter} = require('./app/user');
const {router: postsRouter} = require('./app/post');
const {router: authRouter, localStrategy, jwtStrategy} = require('./app/auth');

// Mount the passport authentication strategies as middleware
passport.use(localStrategy);
passport.use(jwtStrategy);

// Body parsing
app.use(express.json());

/* Route handler for the /api/users/ endpoint
   Used to POST a new user to the DB, not protected */
app.use('/api/users', usersRouter);

/* Route handler for the /api/posts/ endpoint 
   GET (all notes) operation is not protected. POST, PUT, DELETE operations are protected */
app.use('/api/posts', postsRouter);

// Login route handler
app.use('/api/auth', authRouter);

// Run/stop server

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useNewUrlParser: true}, err => {
      if (err) {
        return reject(err);
      }
  
      console.info(`Connected to database at ${databaseUrl}`);
      server = app.listen(port, () => {
        console.info(`The server started listening at ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  })
  .catch(err => {
    return console.error(err);
  });
}

function stopServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.info('The server has disconnected from the DB.');

      server.close(err => {
        if (err) {
          return reject(err);
        }

        console.info('The server has shut down.')
        resolve();
      });
    })
    .catch(err => {
      return console.error(err);
    });
  });
}

// Run the server
if (require.main === module) {
  runServer(DATABASE_URL);
}

module.exports = {app, runServer, stopServer};