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

function seedData() {
  console.info('Seeding post and user data to test DB...');
  const postSeedData = [];
  const userSeedData = [];

  for (let i=0; i<=10; i++) {
    userSeedData.push(generateUserData());
    postSeedData.push(generatePostData());
  }

  /* 
  
  A user has to exist in the DB before a new post can be added 
  Therefore, this is the data storing strategy;

  1) Generate 10 user documents with random data
  2) Generate 10 post documents with random data
  3) Save the user documents in the DB
  4) Retrieve the stored users from the DB and extract their ID's into a new array
  5) Iterate through the the post documents and insert the retrieved user ID's
  6) Save the modified post documents to the DB
  
  Now for every random post document there is a linked user document. Now, 
  the test's won't fail when using the populate() function
  */
  
  return User.insertMany(userSeedData)
    .then(function(users) {
      return users.map(function(user) {
        return user._id
      });
    })
    .then(function(ids) {
      for (let i=0; i<ids.length; i++) {
        postSeedData[i].user = ids[i];
      }
      return postSeedData;
    })
    .then(function (postSeedData) {
      return Post.insertMany(postSeedData);
    });
}

function generateDummyObjectID() {
  return mongoose.Types.ObjectId();
}

function generatePostData() {

  return {
    distance: faker.random.number(),
    runTime: faker.random.number(),
    dateTime: faker.lorem.word(),
    user: generateDummyObjectID(),
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
    email: faker.internet.email(),
    password: faker.lorem.sentence(wordCount = 5),
    avatar: faker.random.number(max = 30)
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
    });
  });

  describe('----- /api/posts/ endpoint -----', function() {

    beforeEach(function() {
      return seedData();
    });
  
    afterEach(function() {
      return tearDownDB();
    });
    
    describe('POST request', function() {

      // Normal Case
      it('Should add a new post to the DB', function() {
        const newPost = generatePostData();

        return User.findOne()
          .then(function(userDB) {
            newPost.user = userDB._id;
          })  
          .then(function() {
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
            })
          });
      });

      // Fail Cases
      it('Should NOT add a new post to the DB (wrong data type sent)', function() {
        const nonValidPost = generatePostData();
        nonValidPost.distance = faker.random.word(); // wrong data type

        return chai.request(app)
          .post('/api/posts/')
          .send(nonValidPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
          });
      });

      it('Should NOT add a new post to the DB (required key missing)', function() {
        const nonValidPost = generatePostData();
        delete nonValidPost.user; // remove 'user'

        return chai.request(app)
          .post('/api/posts/')
          .send(nonValidPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
          });
      });

      it('Should NOT add a new post to the DB if the user doesn\'t exist', function() {
        const nonValidPost = generatePostData();
        nonValidPost.user = '5bd3375a437fb9831fb25479' // non-existent user, but the ID is in a valid MongoDB UserID format

        return chai.request(app)
          .post('/api/posts/')
          .send(nonValidPost)
          .then(function(res) {
            expect(res).to.have.status(HTTP_STATUS_CODES.BAD_REQUEST);
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
                'distance', 'runTime', 'dateTime', 'user'
              );
            });

            return Post.findById(res.body[0].id);
          })
          .then(function(post) {
            expect(res.body[0].id).to.equal(post.id);
            expect(res.body[0].distance).to.equal(post.distance);
            expect(res.body[0].runTime).to.equal(post.runTime);
            expect(res.body[0].dateTime).to.equal(post.dateTime);

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
                  'distance', 'runTime', 'dateTime', 'user'
                );

                return Post.findById(res.body.id)
              })
              .then(function(post) {
                expect(res.body.id).to.equal(post.id);
                expect(res.body.distance).to.equal(post.distance);
                expect(res.body.runTime).to.equal(post.runTime);
                expect(res.body.dateTime).to.equal(post.dateTime);
              });
          });
      });
    });

  });

});