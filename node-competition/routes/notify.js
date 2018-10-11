var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Notify respond with a resource');
});

router.post('/changedNickname',function (req, res) {
    winston.info({message: 'Service node-competitition notified that user changed nickname'});
    winston.info(req.body);

    res.status(200).json({message: 'Service node-competitition notified that user changed nickname', payload: req.body});
});

module.exports = router;
