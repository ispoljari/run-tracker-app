'use strict';

// Import 3rd party frameworks
const express = require('express');
const morgan = require('morgan');

// Initialize an express app
const app = express();

// Setup logging of the HTTP layer
app.use(morgan('combined'));
