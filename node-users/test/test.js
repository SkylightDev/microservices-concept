//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var crypto = require('crypto');
var MongoMock = require('mongomock');

var db = {
    users:[
        {_id:'1',firstName:'Natasha',lastName:'Kerensky', nickname:'Black Widow', password:crypto.createHmac('sha256', 'testpassword').digest('hex'), email:'natasha@test.com', country:'Outreach'},
        {_id:'2',firstName:'Takashi',lastName:'Kurita', nickname:'Kurita', password:crypto.createHmac('sha256', 'testpassword2').digest('hex'), email:'kurita@test.com', country:'Draconis'},
        {_id:'3',firstName:'Jamie',lastName:'Wolf', nickname:'Dragoon', password:crypto.createHmac('sha256', 'testpassword3').digest('hex'), email:'wolf@test.com', country:'Inner Sphere'},
    ]
}
//variable accessible in all application
mongo = new MongoMock(db);

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('HealthCheck', () => {

/*
  * Test the /GET health route
  */
  describe('/GET health', () => {
      it('it should perform a health check', (done) => {
        chai.request(server)
            .get('/health')
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.an('object');
                  res.body.status.should.be.a('string', 'UP')
              done();
            });
      });
  });

});


describe('Users', () => {

/*
  * Test the /GET users list all route
  */
  describe('/GET users', () => {
      it('it should perform a list all users', (done) => {
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('array');
              done();
            });
      });
  });

  /*
    * Test the /GET list one user route
    */
    describe('/GET users/1', () => {
        it('it should perform a list one users', (done) => {
          chai.request(server)
              .get('/users/1')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(1);
                done();
              });
        });
    });

    /*
      * Test the /GET list one user route does not exist
      */
      describe('/GET users/99999', () => {
          it('it should perform a list one user with wrong id', (done) => {
            chai.request(server)
                .get('/users/99999')
                .end((err, res) => {
                      res.should.have.status(422);
                      res.body.should.be.a('string', 'No user is found for the specified criteria');
                  done();
                });
          });
      });


      /*
        * Test the /GET find users route
        */
        describe('/GET users/id/1', () => {
            it('it should perform a find users with criteria', (done) => {
              chai.request(server)
                  .get('/users/id/1')
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.an('array');
                    done();
                  });
            });
        });


        /*
          * Test the /GET find users route with wrong prameters
          */
          describe('/GET users/ids/1', () => {
              it('it should perform a find users with wrong criteria', (done) => {
                chai.request(server)
                    .get('/users/ids/1')
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.errors.should.be.an('array');
                      done();
                    });
              });
          });


          /*
            * Test the /POST create users route
            */
            describe('/POST users/create', () => {
                it('it should perform a create new user', (done) => {
                  chai.request(server)
                      .post('/users/create')
                      .type('form')
                      .send({
                        'nickname': 'Test123',
                        'lastName': 'Test',
                        'firstName': 'Testing',
                        'email': 'test@test.com',
                        'country': 'Outreach',
                        'password': 'Test123.'
                      })
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('string', "User successfully created");
                        done();
                      });
                });
            });


        /*
          * Test the /POST create users with wrong field route
          */
          describe('/POST users/create', () => {
              it('it should perform a create new user with wrong field', (done) => {
                chai.request(server)
                    .post('/users/create')
                    .type('form')
                    .send({
                      'nickname23': 'Test123',
                      'lastName': 'Test',
                      'firstName': 'Testing',
                      'email': 'test@test.com',
                      'country': 'Outreach',
                      'password': 'Test123.'
                    })
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.errors.should.be.an('array');
                      done();
                    });
              });
          });



          /*
            * Test the /PUT update users route
            */
            describe('/PUT users/1', () => {
                it('it should perform an update user id with fields', (done) => {
                  chai.request(server)
                      .put('/users/1')
                      .type('form')
                      .send({
                        'nickname': 'Test123Changed',
                        'lastName': 'Test',
                      })
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('string', "User successfully updated");
                        done();
                      });
                });
            });


         /*
          * Test the /PUT update users with wrong field route
          */
          describe('/PUT users/9999', () => {
              it('it should perform an update user id with wrong field', (done) => {
                chai.request(server)
                    .put('/users/9999')
                    .type('form')
                    .send({
                      'nickname': 'Test123'
                    })
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.be.a('string', 'No user is found for the specified criteria');
                      done();
                    });
              });
          });


          /*
            * Test the /DELETE delete users route
            */
            describe('/DELETE users/1', () => {
                it('it should perform a delete user id', (done) => {
                  chai.request(server)
                      .delete('/users/1')
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('string', "User successfully deleted");
                        done();
                      });
                });
            });


         /*
          * Test the /DELETE delete users with wrong field route
          */
          describe('/DELETE users/9999', () => {
              it('it should perform a delete user id with wrong field', (done) => {
                chai.request(server)
                    .delete('/users/9999')
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.be.a('string');
                      done();
                    });
              });
          });

});
