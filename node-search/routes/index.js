var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Node-search' });
});

/**
* @api {get} /health HealthCheck
* @apiVersion 1.0.0
* @apiName Health
* @apiGroup Index
*
* @apiExample {cUrl} Example usage:
* curl -i http://localhost:3001/health
*
* @apiSuccess (Success 201) {String} UP
*
* @apiSuccessExample {json} Success response:
*     HTTPS 201 OK
*     {
*      "status": "UP!",
*    }
*
*/
router.get('/health', function (req, res, next) {
    res.status(201).json({status: 'UP'});
  });


module.exports = router;
