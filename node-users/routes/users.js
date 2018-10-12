var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeParam } = require('express-validator/filter');
var Request = require("request");

var crypto = require('crypto');

/**
* @api {get} /users Retrieve All Users
* @apiVersion 1.0.0
* @apiName GetAll
* @apiGroup User
*
* @apiExample {cUrl} Example usage:
* curl -i http://localhost:3000/users/
*
* @apiSuccess (Success 200) {JSON} users Object List
*
* @apiSuccessExample {json} Success response:
*     HTTP/1.1 200 OK
*     [
*       {"_id":"1","firstName":"Natasha","lastName":"Kerensky","country":"Outreach","nickname":"Black Widow","email":"natasha@test.com"},
*       {"_id":"2","firstName":"Takashi","lastName":"Kurita","country":"Draconis","nickname":"Kurita","email":"kurita@test.com"},
*       {"_id":"3","firstName":"Jamie","lastName":"Wolf","country":"Inner Sphere","nickname":"Dragoon","email":"wolf@test.com"}
*     ]
*
*/
router.get('/', function(req, res, next) {
    var result;
    mongo.collection('users').find(null, {_id:1, firstName:1, lastName:1, country:1, nickname:1, email: 1}).toArray(function(err,users){
        if (err) { winston.error({ errors: err }); throw err };
      result = users;
    })

    winston.info('List Users called')

    res.status(200).json(result);
});


/**
* @api {get} /users/:id Retrieve a user
* @apiVersion 1.0.0
* @apiName GetOne
* @apiGroup User
*
* @apiParam {String} id - The user id (alphanumeric)
*
* @apiExample {cUrl} Example usage:
* curl -i http://localhost:3000/users/abc23abc23
*
* @apiSuccess {JSON} user Object
*
* @apiSuccessExample {json} Success response:
*     HTTPS 200 OK
*     [
*       {"_id":"1","firstName":"Natasha","lastName":"Kerensky","country":"Outreach","nickname":"Black Widow","email":"natasha@test.com"}
*     ]
*
*/
router.get('/:id([a-zA-Z0-9_]+)', [check('id').isAlphanumeric().withMessage('id must be alphanumeric'), sanitizeParam('*').trim().escape()], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        winston.error({ errors: errors.array() })
        return res.status(422).json({ errors: errors.array() });
    }

      winston.info('List User id:'+req.params.id+ ' called');
      var result;
      mongo.collection('users').find({_id:req.params.id}, {_id:1, firstName:1, lastName:1, country:1, nickname:1, email: 1}).toArray(function(err,users){
          if (err) { winston.error({ errors: err }); throw err };
          result = users;
      })

      if(!result.length>0)
      {
        winston.error("No user is found for the specified criteria")
        return res.status(422).json("No user is found for the specified criteria");
      }

      res.status(200).json(result);
});

/**
* @api {get} /users/:field/:criteria Retrieve users by criteria
* @apiVersion 1.0.0
* @apiName SearchUser
* @apiGroup User
*
* @apiParam {String} field - The user field (alphabetic - and field is one of the following ['nickname','lastName','firstName','country','email','id'])
* @apiParam {String} criteria - The search criteria (alphanumeric)
*
* @apiExample {cUrl} Example usage:
* curl -i http://localhost:3000/users/country/SomeCountry
*
* Note: The search with criteria endpoint currently works only with Match whole word, match case as the mock database module I used does not support regex.
* I tested a few approaches and it might be a bug in the mongomock implementation. Using a live db environment, this endpoint will use regex to search the criteria
*
* @apiSuccess {JSON} users Object List
*
* @apiSuccessExample {json} Success response:
*     HTTPS 200 OK
*     [
*       {"_id":"1","firstName":"Natasha","lastName":"Kerensky","country":"Outreach","nickname":"Black Widow","email":"natasha@test.com"},
*       {"_id":"5bc0491f1c9d4403a4ff5312","firstName":"Test","lastName":"Testing","country":"Outreach","nickname":"TestNickname","email":"test@test.com"}
*     ]
*
*     HTTP/1.1 422 Unprocessable Entity
*     "No user is found for the specified criteria"
*
*     HTTP/1.1 422 Unprocessable Entity
*     {"errors":[
*        {"location":"params",
*         "param":"field",
*         "value":"test",
*         "msg":"The field must be one of the following: 'nickname','lastName','firstName','country','email','id'"
*        }]
*      }
*
*/
router.get('/:field([a-zA-Z]+)/:criteria([a-zA-Z0-9_]+)', [
    check('field').isAlpha().withMessage('The field must be alphabetic').isIn(['nickname','lastName','firstName','country','email','id']).withMessage("The field must be one of the following: 'nickname','lastName','firstName','country','email','id'"),
    check('criteria').isAlphanumeric().withMessage('The criteria must be alphanumeric'),
    sanitizeParam('*').trim().escape()], function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            winston.error({ errors: errors.array() })
            return res.status(422).json({ errors: errors.array() });
        }

        var field = req.params.field;
        var criteria = req.params.criteria;

        if(field=="id")
        {
            field = "_id";
        }
        winston.info('List Users with the following criteria:{field:'+field+', criteria:'+criteria+'} is called');

        var result;
        var query = {};
        query[field] = criteria;
        mongo.collection('users').find(query, {_id:1, firstName:1, lastName:1, country:1, nickname:1, email: 1}).toArray(function(err,users){
          if (err) { winston.error({ errors: err }); throw err };
          result = users;
        })

        if(!result.length>0)
        {
          winston.error("No user is found for the specified criteria")
          return res.status(422).json("No user is found for the specified criteria");
        }


        console.log(result)
        res.status(200).json(result);
});


/**
* @api {delete} /users/:id Delete an user
* @apiVersion 1.0.0
* @apiName Delete
* @apiGroup User
*
* @apiParam {String} id - The user id (alphanumeric)
*
* @apiExample {cUrl} Example usage:
* curl -X "DELETE" http://localhost:3000/users/5bc0491f1c9d4403a4ff5312
*
*
* @apiSuccess {String} message "User successfully deleted"
*
* @apiSuccessExample {json} Success response:
 *     HTTPS 200 OK
 *     {
 *      "User successfully deleted"
 *    }
 *
*/
router.delete('/:id([a-zA-Z0-9_]+)', [check('id').isAlphanumeric().withMessage('id must be alphanumeric'), sanitizeParam('*').trim().escape()], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        winston.error({ errors: errors.array() })
        return res.status(422).json({ errors: errors.array() });
    }

    winston.info('Delete User with id:'+req.params.id+ ' called');

    var result;
    var id = req.params.id;

    mongo.collection('users').find({_id:id},{_id:1}).toArray(function(err,users){
        if (err) { winston.error({ errors: err }); throw err };
      result = users;
    })

    if(result.length > 0){
      mongo.collection('users').remove({_id:id}, function(err, res) {
          if (err) { winston.error({ errors: err }); throw err };

          winston.info({message: 'User '+id+' deleted'});
        });
    }
    else{
      winston.error("User with id:" + id + " does not exist")
      return res.status(422).json("User with id:" + id + " does not exist");
    }

    res.status(200).json('User successfully deleted');
});


/**
* @api {post} /users/create Create an user
* @apiVersion 1.0.0
* @apiName Create
* @apiGroup User
*
* @apiParam (Request body) {String} nickname - The user nickname (alphanumeric)
* @apiParam (Request body) {String} firstName - The user firstname (alphabetic with space)
* @apiParam (Request body) {String} lastName - The user lastname (alphabetic with space)
* @apiParam (Request body) {String} country - The user country (alphanumeric with space)
* @apiParam (Request body) {String} email - The user email (valid email)
* @apiParam (Request body) {String} passowrd - The user password (8-100 chars, Password must include one lowercase character, one uppercase character, a number, and a special character.)
*
* @apiExample {cUrl} Example usage:
* curl -X "POST" -H "Content-Type: application/x-www-form-urlencoded" -d "nickname=Dragoon&firstName=Jamie&lastName=Wolf&country=Inner Sphere&email=jamie@wolf.com&password=Test1234" http://localhost:3000/users
*
* @apiSuccess (Success 200) {String} message "User successfully created"
*
* @apiSuccessExample {json} Success response:
*     HTTPS 200 OK
*     {
*      "User successfully created"
*    }
*
*/
router.post('/create',
    [
        body('nickname').isAlphanumeric().trim().withMessage('Nickname should be alphanumeric'),
        body('firstName').matches(/^[a-zA-Z ]+$/, 'i').trim().withMessage('First Name should be alphabetic'),
        body('lastName').matches(/^[a-zA-Z ]+$/, 'i').trim().withMessage('Last Name should be alphabetic'),
        body('country').matches(/^[a-zA-Z0-9_ ]+$/, 'i').trim().withMessage('Country should be alphanumeric'),
        body('email').isEmail().trim().withMessage('Email should be a valid email'),
        body('password').isLength({ min: 8, max: 100}).withMessage('Password must be between 8-100 characters long.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i').withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),
        sanitizeBody('*').trim().escape()
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            winston.error({ errors: errors.array() })
            return res.status(422).json({ errors: errors.array() });
        }
        winston.info('Create User called');

        var user = {
            nickname: req.body.nickname,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            country: req.body.country,
            email: req.body.email,
            password: crypto.createHmac('sha256', req.body.password).digest('hex'),
        }

        mongo.collection('users').insert(user, function(err, res) {
            if (err) { winston.error({ errors: err }); throw err };

            winston.info({message: 'User created'})
            winston.info({user});

            Request.post({
                "headers": { "content-type": "application/json" },
                "url": "http://localhost:3001/notify/newUser",
                "body": JSON.stringify({
                    nickname: req.body.nickname,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    country: req.body.country,
                    email: req.body.email,
                    _id: user.id
                })
            }, (error, response, body) => {
                if(error) {
                    winston.error({ errors: error });
                    winston.error({message: 'Search microservice could not be notified'})
                }
                else {
                    winston.info({message: 'Search microservice notified: new user created'})
                }
            });

          });

        res.status(200).json('User successfully created');
})


/**
* @api {put} /users/:id Update an user
* @apiVersion 1.0.0
* @apiName Update
* @apiGroup User
*
* @apiParam {String} id The user id
*
* @apiParam (Request body) {String} nickname - The user nickname (alphanumeric)
* @apiParam (Request body) {String} firstName - The user firstname (alphabetic with space)
* @apiParam (Request body) {String} lastName - The user lastname (alphabetic with space)
* @apiParam (Request body) {String} country - The user country (alphanumeric with space)
* @apiParam (Request body) {String} email - The user email (valid email)
* @apiParam (Request body) {String} passowrd - The user password (8-100 chars, Password must include one lowercase character, one uppercase character, a number, and a special character.)
*
* @apiExample {cUrl} Example usage:
* curl -X "PUT" -H "Content-Type: application/x-www-form-urlencoded" -d "nickname=Dragoons&country=InnerSphere&email=jamie@wolf23.com" http://localhost:3000/users/1
*
*
* @apiSuccess {String} message User successfully updated
*
* @apiSuccessExample {json} Success response:
 *     HTTPS 200 OK
 *     {
 *      "User successfully updated"
 *    }
 *
*/
router.put('/:id([a-zA-Z0-9_]+)',
    [
        check('id').isAlphanumeric().withMessage('id must be alphanumeric'),

        body('nickname').optional().isAlphanumeric().trim().withMessage('Nickname should be alphanumeric'),
        body('firstName').optional().matches(/^[a-zA-Z ]+$/, 'i').trim().withMessage('First Name should be alphabetic'),
        body('lastName').optional().matches(/^[a-zA-Z ]+$/, 'i').trim().withMessage('Last Name should be alphabetic'),
        body('country').optional().matches(/^[a-zA-Z0-9_ ]+$/, 'i').trim().withMessage('Country should be alphanumeric'),
        body('email').optional().isEmail().trim().withMessage('Email should be a valid email'),
        body('password').optional().isLength({ min: 8, max: 100}).withMessage('Password must be between 8-100 characters long.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i').withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

        sanitizeBody('*').trim().escape(),
        sanitizeParam('*').trim().escape()
    ],
    function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        winston.error({ errors: errors.array() })
        return res.status(422).json({ errors: errors.array() });
    }

    var id = req.params.id;
    winston.info('Update User id:'+id+' called')

    var user;
    mongo.collection('users').find({_id:id}).toArray(function(err,result){
        if (err) { winston.error({ errors: err }); throw err };
        user = result;
    })

    if(user.length>0){
        user = user[0];
        var notifyCompetitionService = false;
        if(req.body.nickname && req.body.nickname != user.nickname){
            //notify competition service that the user has changed the nickname
            notifyCompetitionService = true;
        }
        user.nickname = (req.body.nickname)?req.body.nickname:user.nickname;
        user.firstName = (req.body.firstName)?req.body.firstName:user.firstName;
        user.lastName = (req.body.lastName)?req.body.lastName:user.lastName;
        user.country = (req.body.country)?req.body.country:user.country;
        user.email = (req.body.email)?req.body.email:user.email;
        user.password = (req.body.password)?crypto.createHmac('sha256', req.body.password).digest('hex'):user.password;

        mongo.collection('users').update({_id: id}, user, {upsert: true}, function(err, res) {
            if (err) { winston.error({ errors: err }); throw err };

            winston.info({message: 'User '+id+' updated'})
            winston.info({user});

            if(notifyCompetitionService){
                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "http://localhost:3002/notify/changedNickname",
                    "body": JSON.stringify({
                        nickname: req.body.nickname,
                        _id: id
                    })
                }, (error, response, body) => {
                    if(error) {
                        winston.error({ errors: error });
                        winston.error({message: 'Competition microservice could not be notified'})
                    }
                    else {
                        winston.info({message: 'Competition microservice notified: user changed nickname'})
                    }
                });
            }
          });
    }
    else{
        winston.error("User with id:" + id + " does not exist")
        return res.status(422).json("User with id:" + id + " does not exist");
    }

    res.status(200).json('User successfully updated');
})


module.exports = router;
