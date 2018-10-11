var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Notify respond with a resource');
});

router.post('/newUser',function (req, res) {
    winston.info({message: 'Service node-search notified that a new user was created'});
    winston.info(req.body);

    res.status(200).json({message: 'Service node-search notified that a new user was created', payload: req.body});
});

module.exports = router;
