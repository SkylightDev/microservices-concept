//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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


describe('Notify', () => {

      /*
        * Test the /POST Notify new user created
        */
        describe('/POST notify/newUser', () => {
            it('it should perform a notify when a new user was created', (done) => {
              chai.request(server)
                  .post('/notify/newUser')
                  .type('form')
                  .send({
                    'nickname': 'Test123'
                  })
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.message.should.be.a('string', "Service node-competitition notified that user changed nickname");
                    done();
                  });
            });
        });



});
