var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Notify respond with a resource');
});


/**
* @api {post} /notify/newUser Notify new user created
* @apiVersion 1.0.0
* @apiName NotifyNewUser
* @apiGroup Notify
*
* @apiParam (Request body) {String} nickname - The user nickname
* @apiParam (Request body) {String} firstName - The user nickname
* @apiParam (Request body) {String} lastName - The user lastName
* @apiParam (Request body) {String} country - The user country
* @apiParam (Request body) {String} email - The user email
* @apiParam (Request body) {String} _id - The user id
*
* @apiExample {js} Example usage:
* Request.post({
*    "headers": { "content-type": "application/json" },
*    "url": "http://localhost:3001/notify/newUser",
*    "body": JSON.stringify({
*        nickname: req.body.nickname,
*        firstName: req.body.firstName,
*        lastName: req.body.lastName,
*        country: req.body.country,
*        email: req.body.email,
*        _id: user.id
*    })
* }, (error, response, body) => {
*    if(error) {
*        winston.error({ errors: error });
*        winston.error({message: 'Search microservice could not be notified'})
*    }
*    else {
*        winston.info({message: 'Search microservice notified: new user created'})
*    }
*});
* @apiSuccess (Success 200) {String} message 'Service node-search notified that a new user was created'
* @apiSuccess (Success 200) {String} payload req.body Object
*
* @apiSuccessExample {json} Success response:
*     HTTPS 200 OK
*     {
*      message: 'Service node-search notified that a new user was created', payload: req.body
*    }
*
*/
router.post('/newUser',function (req, res) {
    winston.info({message: 'Service node-search notified that a new user was created'});
    winston.info(req.body);

    res.status(200).json({message: 'Service node-search notified that a new user was created', payload: req.body});
});

module.exports = router;
