var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Notify respond with a resource');
});

/**
* @api {post} /notify/changedNickname Notify user changed nickname
* @apiVersion 1.0.0
* @apiName NotifyChangedNickname
* @apiGroup Notify
*
* @apiParam (Request body) {String} nickname - The user nickname
* @apiParam (Request body) {String} _id - The user id
*
* @apiExample {js} Example usage:
* Request.post({
*    "headers": { "content-type": "application/json" },
*    "url": "http://localhost:3002/notify/changedNickname",
*    "body": JSON.stringify({
*        nickname: req.body.nickname,
*        _id: id
*    })
* }, (error, response, body) => {
*    if(error) {
*        winston.error({ errors: error });
*        winston.error({message: 'Competition microservice could not be notified'})
*    }
*    else {
*        winston.info({message: 'Competition microservice notified: user changed nickname'})
*    }
* });

* @apiSuccess (Success 200) {String} message 'Service node-competitition notified that user changed nickname'
* @apiSuccess (Success 200) {String} payload req.body Object
*
* @apiSuccessExample {json} Success response:
*     HTTPS 200 OK
*     {
*      message: 'Service node-competitition notified that user changed nickname', payload: req.body
*    }
*
*/
router.post('/changedNickname',function (req, res) {
    winston.info({message: 'Service node-competitition notified that user changed nickname'});
    winston.info(req.body);

    res.status(200).json({message: 'Service node-competitition notified that user changed nickname', payload: req.body});
});

module.exports = router;
