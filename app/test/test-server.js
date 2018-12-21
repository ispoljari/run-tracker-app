'use strict';
const result = require('dotenv').config();

// Import 3rd party frameworks, libraries or project modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('../user');
const {Post} = require('../post');

const {TEST_DATABASE_URL, HTTP_STATUS_CODES, JWT_SECRET} = require('../../config');
const {app, runServer, stopServer} = require('../../server');

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

// Dummy data 
const userData = {
  postSeedData: {},
  userSeedData: {},
  jwtToken: ''
}

function seedData() {
  const promise = new Promise(function(resolve, reject) {
    userData.userSeedData = generateUserData();
    userData.postSeedData = generatePostData();
    resolve(userData.userSeedData);
  });

  // Hash the password of the random generated user, save the user to the DB, then connect the user to the post
  return promise.then(function(randomUser) {
    return User.hashPassword(randomUser.password)
      .then(function(hashedPassword) {
        return User.create({
          name: randomUser.name,
          displayName: randomUser.displayName,
          username: randomUser.username,
          password: hashedPassword,
          avatar: randomUser.avatar
        })
      })
      .then(function(userDB) {
        userData.postSeedData.user = userDB._id;
        return Post.create(userData.postSeedData);
      });
  });
}

function generateDummyObjectID() {
  return mongoose.Types.ObjectId();
}

function generatePostData() {

  return {
    title: faker.lorem.sentence(),
    distanceValue: faker.random.number(),
    distanceUnit: faker.lorem.word(),
    durationHours: faker.random.number(),
    durationMinutes: faker.random.number(),
    durationSeconds: faker.random.number(),
    runType: faker.lorem.word(),
    date: faker.lorem.word(),
    time: faker.lorem.word(),
    description: faker.lorem.word(),
    privacy: faker.lorem.word(),
    // user: generateDummyObjectID(),
    upvotes : [{
      userId: generateDummyObjectID()
    }]
  }
}

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

function tearDownDB() {
  return mongoose.connection.dropDatabase();
}

// Test if the server is sending static files, from the /public folder, to the client

describe('///////////// API RESOURCES //////////', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return stopServer();
  });

  describe('***** Static files ****', function() {

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

  describe('***** Endpoints *****', function() {
    describe('----- /api/users/ endpoint -----', function() {

      beforeEach(function() {
        return seedData()
          .then(function() {
            return userData.userSeedData;
          })
          .then(function(user) {
            // Obtain a valid JWT token
            return chai.request(app)
            .post('/api/auth/login')
            .send({
              username: user.username,
              password: user.password
            })
            .then(function(res) {
              userData.jwtToken = res.body.authToken;
            })
          });
      });
    
      afterEach(function() {
        return tearDownDB();
      });
  
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
                'name', 'displayName', 'username', 'avatar', 'id'
              );
              expect(res.body.id).to.not.be.null;

              // compare the API response with the sent data
              expect(res.body.name).to.equal(newUser.name);
              expect(res.body.name).to.be.a('string');
    
              expect(res.body.displayName).to.equal(newUser.displayName);
              expect(res.body.displayName).to.be.a('string');
    
              expect(res.body.username).to.equal(newUser.username);
              expect(res.body.username).to.be.a('string');
    
              expect(res.body.avatar).to.equal(newUser.avatar);
              expect(res.body.avatar).to.be.a('number');
    
              return User.findById(res.body.id);
            })
            .then(function(user) { //inspect the DB, and compare it's state to the API response
              expect(user.name).to.equal(newUser.name);
              expect(user.displayName).to.equal(newUser.displayName);
              expect(user.username).to.equal(newUser.username);
              expect(user.avatar).to.equal(newUser.avatar);
            });
        });

        // Fail Cases
        it('Should NOT add a new user to the DB (wrong data type sent)', function() {
          const nonValidUser = generateUserData();
          nonValidUser.name = faker.random.number() // wrong data type
  
          return chai.request(app)
            .post('/api/users/')
            .send(nonValidUser)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });

        it('Should NOT add a new user to the DB (required key missing)', function() {
          const nonValidUser = generateUserData();
          delete nonValidUser.name; // delete required key
  
          return chai.request(app)
            .post('/api/users/')
            .send(nonValidUser)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });
    
      });

      describe('GET request', function() {
        it ('Should retrieve a single user by ID', function() {
          let res;

          //Normal case
          return User.findOne()
            .then(function(user) {
              return user._id;
            })
            .then(function(id) {
              return chai.request(app)
              .get(`/api/users/${id}`)
              .set('Authorization', `Bearer ${userData.jwtToken}`)
              .then(function(_res) {
                res = _res;
                expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                expect(res).to.be.a('object');
                expect(res.body).to.include.keys(
                  'name', 'displayName', 'username', 'avatar'
                );

                return User.findById(id);
              })
              .then(function(user) {
                expect(user.name).to.be.equal(res.body.name);
                expect(user.displayName).to.be.equal(res.body.displayName);
                expect(user.username).to.be.equal(res.body.username);
                expect(user.avatar).to.be.equal(res.body.avatar);
              });
            })
        });
      });

      describe('PUT requests', function() {
        it('Should update the data fields of user with a specific ID', function() {
          const updateData = generateUserData();
          delete updateData.password;

          return User.findOne()
            .then(function(user) {
              updateData.id = user._id;

              return chai.request(app)
                .put(`/api/users/${user.id}`)
                .set('Authorization', `Bearer ${userData.jwtToken}`)
                .send(updateData);
            })
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.CREATED);
              
              return User.findById(updateData.id);
            })
            .then(function(user){
              expect(user.name).to.be.equal(updateData.name);
              expect(user.displayName).to.be.equal(updateData.displayName);
              expect(user.avatar).to.be.equal(updateData.avatar);
            });
        });
      });

      describe('DELETE request', function() {
        it('Should delete a user by specific ID', function() {
          let user;

          return User.findOne()
            .then(function(_user) {
              user = _user;

              return chai.request(app)
                .delete(`/api/users/${user.id}`)
                .set('Authorization', `Bearer ${userData.jwtToken}`)
            })
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.NO_CONTENT);
              return User.findById(user.id);
            })
            .then(function(_user) {
              expect(_user).to.be.null;
            });
        });
      });
    });
 
    describe('----- /api/posts/ endpoint -----', function() {

      beforeEach(function() {
        return seedData()
          .then(function() {
            return userData.userSeedData;
          })
          .then(function(user) {
            // Obtain a valid JWT token
            return chai.request(app)
            .post('/api/auth/login')
            .send({
              username: user.username,
              password: user.password
            })
            .then(function(res) {
              userData.jwtToken = res.body.authToken;
            })
          });
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
            .set('Authorization', `Bearer ${userData.jwtToken}`)
            .send(newPost)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.CREATED);
              expect(res).to.be.json;
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys(
                'title', 'distanceValue', 'distanceUnit', 'durationHours', 'durationMinutes', 'durationSeconds', 'runType', 'date', 'time', 'description', 'privacy', 'upvotes', 'id'
              );
              expect(res.body.upvotes).to.be.a('array');
              expect(res.body.upvotes[0]).to.be.a('object');
              expect(res.body.upvotes[0]).to.include.keys(
                'userId'
              );

              // compare the API response with the sent data
              expect(res.body.title).to.equal(newPost.title);
              expect(res.body.title).to.be.a('string');

              expect(res.body.distanceValue).to.equal(newPost.distanceValue);
              expect(res.body.distanceValue).to.be.a('number');

              expect(res.body.distanceUnit).to.equal(newPost.distanceUnit);
              expect(res.body.distanceUnit).to.be.a('string');
    
              expect(res.body.durationHours).to.equal(newPost.durationHours);
              expect(res.body.durationHours).to.be.a('number');

              expect(res.body.durationMinutes).to.equal(newPost.durationMinutes);
              expect(res.body.durationMinutes).to.be.a('number');

              expect(res.body.durationSeconds).to.equal(newPost.durationSeconds);
              expect(res.body.durationSeconds).to.be.a('number');

              expect(res.body.runType).to.equal(newPost.runType);
              expect(res.body.runType).to.be.a('string');

              expect(res.body.date).to.equal(newPost.date);
              expect(res.body.date).to.be.a('string');

              expect(res.body.time).to.equal(newPost.time);
              expect(res.body.time).to.be.a('string');

              expect(res.body.description).to.equal(newPost.description);
              expect(res.body.description).to.be.a('string');

              expect(res.body.privacy).to.equal(newPost.privacy);
              expect(res.body.privacy).to.be.a('string');

              expect(res.body.user).to.not.be.null;
              expect(res.body.id).to.not.be.null;
              expect(res.body.upvotes).to.have.lengthOf.at.least(1);
              expect(res.body.upvotes[0]).to.not.be.null;
              expect(res.body.upvotes[1]).to.not.be.null;
    
              return Post.findById(res.body.id);
            })
            .then(function(post) { //inspect the DB, and compare it's state to the API response

              expect(post.title).to.equal(newPost.title);

              expect(post.distanceValue).to.equal(newPost.distanceValue);

              expect(post.distanceUnit).to.equal(newPost.distanceUnit);

              expect(post.durationHours).to.equal(newPost.durationHours);

              expect(post.durationMinutes).to.equal(newPost.durationMinutes);

              expect(post.durationSeconds).to.equal(newPost.durationSeconds);

              expect(post.runType).to.equal(newPost.runType);

              expect(post.date).to.equal(newPost.date);

              expect(post.time).to.equal(newPost.time);

              expect(post.description).to.equal(newPost.description);

              expect(post.privacy).to.equal(newPost.privacy);

              expect(post.user).to.not.be.null;
              expect(post.id).to.not.be.null;
              expect(post.upvotes).to.have.lengthOf.at.least(1);
              expect(post.upvotes[0]).to.not.be.null;
            });
        });

        // Fail Cases
        it('Should NOT add a new post to the DB (wrong data type sent)', function() {
          const nonValidPost = generatePostData();
          nonValidPost.distanceValue = faker.random.word(); // wrong data type

          return chai.request(app)
            .post('/api/posts/')
            .set('Authorization', `Bearer ${userData.jwtToken}`)
            .send(nonValidPost)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });

        it('Should NOT add a new post to the DB (required key missing)', function() {
          const nonValidPost = generatePostData();
          delete nonValidPost.title; // remove title

          return chai.request(app)
            .post('/api/posts/')
            .set('Authorization', `Bearer ${userData.jwtToken}`)
            .send(nonValidPost)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
            });
        });

        it('Should NOT add a new post to the DB if the user doesn\'t exist', function() {
          const nonValidPost = generatePostData();
          userData.jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Y65Kf4fgjGTUI6lU38lUjV9jySDM2RsMkb4GPgHa6dc' // false JWT token

          return chai.request(app)
            .post('/api/posts/')
            .set('Authorization', `Bearer ${userData.jwtToken}`)
            .send(nonValidPost)
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.UNAUTHORIZED);
            });
        });
      });

      describe('GET requests', function() {

        // Testing only the Normal Case
        it('Should retrieve all posts from the DB', function() {
          let res;

          return chai.request(app)
            .get('/api/posts/')
            .then(function(_res) {
              res = _res;
              expect(res).to.have.status(HTTP_STATUS_CODES.OK);
              expect(res).to.be.json;
              expect(res.body).to.be.a('array');
              expect(res.body).to.have.lengthOf.at.least(1);

              res.body.forEach(function(post) {
                expect(post).to.be.a('object');
                expect(post).to.include.keys(
                  'title', 'distanceValue', 'distanceUnit', 'durationHours', 'durationMinutes', 'durationSeconds', 'runType', 'date', 'time', 'description', 'privacy', 'upvotes', 'id', 'user'
                );
              });

              return Post.findById(res.body[0].id);
            })
            .then(function(post) {
              expect(res.body[0].id).to.equal(post.id);
              expect(res.body[0].title).to.equal(post.title);
              expect(res.body[0].distanceValue).to.equal(post.distanceValue);
              expect(res.body[0].distanceUnit).to.equal(post.distanceUnit);
              expect(res.body[0].durationHours).to.equal(post.durationHours);
              expect(res.body[0].durationMinutes).to.equal(post.durationMinutes);
              expect(res.body[0].durationSeconds).to.equal(post.durationSeconds);
              expect(res.body[0].runType).to.equal(post.runType);
              expect(res.body[0].date).to.equal(post.date);
              expect(res.body[0].time).to.equal(post.time);
              expect(res.body[0].description).to.equal(post.description);
              expect(res.body[0].privacy).to.equal(post.privacy);
              expect(res.body[0].user.id).to.equal(post.user.toString());

              return Post.countDocuments();
            })
            .then(function(count) {
              expect(res.body).to.have.lengthOf(count);
            });
        });

        it('Should retrieve a single post by ID from the DB', function() {
          let res;

          return Post.findOne()
            .then(function(post) {
              return post._id;
            })
            .then(function(id) {
              return chai.request(app) 
                .get(`/api/posts/${id}`)
                .then(function(_res) {
                  res = _res;
                  expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                  expect(res.body).to.be.a('object');
                  expect(res.body).to.include.keys(
                    'title', 'distanceValue', 'distanceUnit', 'durationHours', 'durationMinutes', 'durationSeconds', 'runType', 'date', 'time', 'description', 'privacy', 'upvotes', 'id', 'user'
                  );

                  return Post.findById(res.body.id)
                })
                .then(function(post) {
                  expect(res.body.id).to.equal(post.id);
                  expect(res.body.title).to.equal(post.title);
                  expect(res.body.distanceValue).to.equal(post.distanceValue);
                  expect(res.body.distanceUnit).to.equal(post.distanceUnit);
                  expect(res.body.durationHours).to.equal(post.durationHours);
                  expect(res.body.durationMinutes).to.equal(post.durationMinutes);
                  expect(res.body.durationSeconds).to.equal(post.durationSeconds);
                  expect(res.body.runType).to.equal(post.runType);
                  expect(res.body.date).to.equal(post.date);
                  expect(res.body.time).to.equal(post.time);
                  expect(res.body.description).to.equal(post.description);
                  expect(res.body.privacy).to.equal(post.privacy);
                  expect(res.body.user.id).to.equal(post.user.toString());
                });
            });
        });
      });

      describe('PUT requests', function() {

        // Test the normal case
        it('Should update the data fields of a post with a specific ID', function() {
          const updateData = generatePostData();
          delete updateData.upvotes[0];

          return Post.findOne()
            .then(function(post) {
              updateData.id = post.id;

              return chai.request(app)
                .put(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${userData.jwtToken}`)
                .send(updateData);
            })
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.NO_CONTENT);
              
              return Post.findById(updateData.id);
            })
            .then(function(post){
              expect(updateData.title).to.equal(post.title);
              expect(updateData.distanceValue).to.equal(post.distanceValue);
              expect(updateData.distanceUnit).to.equal(post.distanceUnit);
              expect(updateData.durationHours).to.equal(post.durationHours);
              expect(updateData.durationMinutes).to.equal(post.durationMinutes);
              expect(updateData.durationSeconds).to.equal(post.durationSeconds);
              expect(updateData.runType).to.equal(post.runType);
              expect(updateData.date).to.equal(post.date);
              expect(updateData.time).to.equal(post.time);
              expect(updateData.description).to.equal(post.description);
              expect(updateData.privacy).to.equal(post.privacy);
            });
        });
      });

      describe('DELETE requests', function() {
        it('Should delete a post with a specific ID', function() {
          let post;

          return Post.findOne()
            .then(function(_post) {
              post = _post;

              return chai.request(app)
                .delete(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${userData.jwtToken}`);
            })
            .then(function(res) {
              expect(res).to.have.status(HTTP_STATUS_CODES.NO_CONTENT);
              return Post.findById(post.id);
            })
            .then(function(_post) {
              expect(_post).to.be.null;
            });
        });
      });
    });
  });
});