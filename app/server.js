'use strict';

// Import 3rd party frameworks
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Initialize an express app
const app = express();

// Setup logging of the HTTP layer
app.use(morgan('combined'));

// Serve static assets to client
app.use(express.static(path.join(__dirname, 'public')));

// Run the server
if (require.main === module) {
  app.listen(process.env.PORT || 8080, ()=> {
    console.info(`The server started listening at port ${process.env.PORT || 8080}`);
  });
}

module.exports = {app};