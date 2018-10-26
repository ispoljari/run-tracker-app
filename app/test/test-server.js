'use strict';

// Import 3rd party frameworks, libraries or project modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {User} = require('../user');
const {Post} = require('../post');

const {TEST_DATABASE_URL, HTTP_STATUS_CODES} = require('../config');
const {app, runServer, stopServer} = require('../server');

// Setup the expect syntax from chai
const expect = chai.expect;

// Setup chai HTTP layer testing middleware
chai.use(chaiHttp);


/* INTEGRATION TESTS STRATEGY

1) SEED A TEST DATABASE BEFORE EACH HTTP REQUEST

2) MAKE HTTP REQUESTS TO DATABASE

3) INSPECT THE DATABASE AND COMPARE TO API RESPONSES

4) TEAR DOWN THE TEST DATABASE AFTER EACH HTTP REQUEST

*/

function seedPostData() {
  console.info('Seeding post data to test DB...');
  const postSeedData = [];

  for (let i=0; i<=10; i++) {
    postSeedData.push(generatePostData());
  }

  return Post.insertMany(postSeedData);
}

function generatePostData() {
  let id = mongoose.Types.ObjectId();

  return {
    distance: faker.random.number(),
    runTime: faker.random.number(),
    dateTime: faker.lorem.word(),
    user: id,
    upvotes : [{
      userId: id
    }]
  }
}

function generateUserData() {
  return {
    name: faker.name.firstName(),
    displayName: faker.name.jobTitle(),
    email: faker.internet.email(),
    password: faker.lorem.sentence(),
    avatar: faker.random.number()
  }
}

function tearDownDB() {
  console.warn('Tearing down test database...');
  return mongoose.connection.dropDatabase();
}

// Test if the server is sending static files, from the /public folder, to the client

describe('///////////// INTEGRATION TESTS //////////', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });


  after(function() {
    return stopServer();
  });

  describe('***** Client receiving static files ****', function() {

    describe('----- Main page (index.html) -----', function() {

      it('Should be sent to client on GET', function() {
        return chai.request(app)
          .get('/')
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.OK);
          });
      });
    });
  });

  describe('***** API resources *****', function() {
  
    describe('----- /api/users/ endpoint -----', function() {
  
      describe('POST request', function() {
     
        // Normal Case
        it('Should add a new user to the DB', function() {
          const newUser = generateUserData();
    
          return chai.request(app)  
            .post('/api/users/')
            .send(newUser)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.CREATED);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys(
                'name', 'displayName', 'email', 'avatar', 'id'
              );
              expect(res.body.id).to.not.be.null;

              // compare the API response with the sent data
              expect(res.body.name).to.equal(newUser.name);
              expect(res.body.name).to.be.a('string');
    
              expect(res.body.displayName).to.equal(newUser.displayName);
              expect(res.body.displayName).to.be.a('string');
    
              expect(res.body.email).to.equal(newUser.email);
              expect(res.body.email).to.be.a('string');
    
              expect(res.body.avatar).to.equal(newUser.avatar);
              expect(res.body.avatar).to.be.a('number');
    
              return User.findById(res.body.id);
            })
            .then(function(user) { //inspect the DB, and compare it's state to the API response
              expect(user.name).to.equal(newUser.name);
              expect(user.displayName).to.equal(newUser.displayName);
              expect(user.email).to.equal(newUser.email);
              expect(user.avatar).to.equal(newUser.avatar);
            });
        });

        // Fail Cases
        it('Should NOT add a new user to the DB (wrong data type sent)', function() {
          const nonValidUser = {
            name: faker.random.number(), // wrong data type
            displayName: faker.name.jobTitle(),
            email: faker.internet.email(),
            password: faker.lorem.sentence(),
            avatar: faker.random.number()
          };
  
          return chai.request(app)
            .post('/api/users/')
            .send(nonValidUser)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });

        it('Should NOT add a new user to the DB (required key missing)', function() {
          const nonValidUser = {
            displayName: faker.name.jobTitle(),
            email: faker.internet.email(),
            password: faker.lorem.sentence(),
            avatar: faker.random.number()
          };
  
          return chai.request(app)
            .post('/api/users/')
            .send(nonValidUser)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });
    
      });
    });
  });

  describe('----- /api/post/ endpoint -----', function() {

    beforeEach(function() {
      return seedPostData();
    });
  
    afterEach(function() {
      return tearDownDB();
    });
    
    describe('POST request', function() {

      // Normal Case
      it('Should add a new post to the DB', function() {
        const newPost = generatePostData();

        return chai.request(app)
          .post('/api/posts/')
          .send(newPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.CREATED);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(
              'distance', 'runTime', 'dateTime', 'user', 'upvotes', 'id'
            );
            expect(res.body.upvotes).to.be.a('array');
            expect(res.body.upvotes[0]).to.be.a('object');
            expect(res.body.upvotes[0]).to.include.keys(
              'userId'
            );

            // compare the API response with the sent data
            expect(res.body.distance).to.equal(newPost.distance);
            expect(res.body.distance).to.be.a('number');
  
            expect(res.body.runTime).to.equal(newPost.runTime);
            expect(res.body.runTime).to.be.a('number');

            expect(res.body.dateTime).to.equal(newPost.dateTime);
            expect(res.body.dateTime).to.be.a('string');

            expect(res.body.user).to.not.be.null;
            expect(res.body.id).to.not.be.null;
  
            expect(res.body.upvotes).to.have.lengthOf.at.least(1);
            expect(res.body.upvotes[0]).to.not.be.null;
            expect(res.body.upvotes[1]).to.not.be.null;
  
            return Post.findById(res.body.id);
          })
          .then(function(post) { //inspect the DB, and compare it's state to the API response
          expect(post.distance).to.equal(newPost.distance);
          expect(post.runTime).to.equal(newPost.runTime);
          expect(post.dateTime).to.equal(newPost.dateTime);
          expect(post.user).to.not.be.null;
          expect(post.id).to.not.be.null;
          expect(post.upvotes).to.have.lengthOf.at.least(1);
          expect(post.upvotes[0]).to.not.be.null;
          });
      });

      // Fail Cases
      it('Should NOT add a new post to the DB (wrong data type sent)', function() {
        let id = mongoose.Types.ObjectId();

        const nonValidPost = {
          distance: faker.random.word(), // wrong data type
          runTime: faker.random.number(),
          dateTime: faker.lorem.word(),
          user: id,
          upvotes : [{
            userId: id
          }]
        };

        return chai.request(app)
          .post('/api/posts/')
          .send(nonValidPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
          });
      });

      it('Should NOT add a new post to the DB (required key missing)', function() {
        let id = mongoose.Types.ObjectId();

        const nonValidPost = {
          distance: faker.random.number(), 
          runTime: faker.random.number(),
          dateTime: faker.lorem.word(),
          upvotes : [{
            userId: id
          }]
        };

        return chai.request(app)
          .post('/api/posts/')
          .send(nonValidPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
          });
      });

    });

  });

});