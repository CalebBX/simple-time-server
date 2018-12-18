var _ = require('lodash');
var express = require('express');
var router = express.Router();
const { authenticate } = require('../middleware/authenticate.js');
const { User } = require('../models/user');
const { mongoose } = require('../db/mongoose.js');

router.post('/', function(req, res) {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save()
        .then(function(e) {
            return user.generateAuthToken();
        })
        .then(function(token) {
            res.header('x-auth', token).send(user);
        })
        .catch(function(e) {
            res.status(400).send(e);
        });
});

router.get('/me', authenticate, function(req, res) {
    res.send(req.user);
});

router.post('/login', function(req, res) {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
        .then(function(user) {
            return user.generateAuthToken().then(function(token) {
                res.header('x-auth', token).send(user);
            });
        })
        .catch(function(e) {
            res.status(400).send();
        });
});

router.delete('/me/token', authenticate, function(req, res) {
    req.user.removeToken(req.token).then(
        function() {
            res.status(200).send();
        },
        function() {
            res.status(400).send();
        }
    );
});

module.exports = router;
