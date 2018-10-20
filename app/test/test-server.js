'use strict';

// Import 3rd party frameworks, libraries or project modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

// Setup the expect assertion library
const expect = chai.expect;

// Setup chai HTTP layer testing middleware
chai.use(chaiHttp);

// Test if the server is sending static files to the client
describe('main page (index.html)', function() {
  it('should exist', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});