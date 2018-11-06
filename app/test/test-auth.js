'use strict';
const result = require('dotenv').config();

if (result.error) {
  console.log(result.parsed);
  throw result.error
}

// Import 3rd party frameworks, libraries or project modules
const chai = require('chai')
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('../user');

const {TEST_DATABASE_URL, HTTP_STATUS_CODES, JWT_SECRET} = require('../../config')
const {app, runServer, stopServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

// Generate dummy user data
function generateUserData() {
  let wordCount;
  let max;

  return {
    name: faker.name.firstName(),
    displayName: faker.name.jobTitle(),
    username: faker.internet.email(),
    password: faker.lorem.sentence(wordCount = 5),
    avatar: faker.random.number(max = 30)
  }
}

function validateResponse(res, token) {
  expect(res).to.have.status(HTTP_STATUS_CODES.OK);
  expect(res.body).to.be.a('object');
  expect(token).to.be.a('string');
  
  const payload = jwt.verify(token, JWT_SECRET, {
    algorithm: ['HS256']
  });
  expect(payload.user).to.have.keys(
    'name', 'username', 'displayName', 'avatar', 'id'
  )
}

function tearDownDB() {
  console.warn('Tearing down test database...');
  return mongoose.connection.dropDatabase();
}

describe('***** AUTH endpoints *****', function() {
  let jwtTokenOld, 
      newUser, 
      username, 
      password;

  before(function() {
    return runServer(TEST_DATABASE_URL)
      .then(function() {
        newUser = generateUserData();
        username = newUser.username;
        password = newUser.password;
      });
  });

  after(function() {
    return tearDownDB()
      .then(function() {
        stopServer();
      });
  });

  describe('----- /api/auth endpoint -----', function() {

    // Normal case
    it('Should return a valid JWT token', function() {
      return User.hashPassword(newUser.password)
        .then(function(hashedPassword) {
          newUser.password = hashedPassword;
          return User.create(newUser);
        })
        .then(function(user) {
          return chai.request(app)
            .post('/api/auth/login')
            .send({username, password})
            .then(function(res) {
              jwtTokenOld = res.body.authToken;
              validateResponse(res, jwtTokenOld);
            });
        });
    });

    it('Should exchange the expired JWT token for a new one', function() {
      return chai.request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${jwtTokenOld}`)
        .then(function(res) {
          let jwtTokenNew = res.body.authToken;
          validateResponse(res, jwtTokenNew);
        });
    });
  });
});