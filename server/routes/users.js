let _ = require('lodash');
let express = require('express');
let router = express.Router();
const { authenticate } = require('../middleware/authenticate.js');
const { User } = require('../models/user');
const { mongoose } = require('../db/mongoose.js');

router.post('/', function(req, res) {
    let body = _.pick(req.body, ['email', 'password', 'nameFirst', 'nameLast']);
    let user = new User(body);
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
router.get('/', authenticate, function(req, res) {
    User.find({}).then(function(users) {
        res.send(users);
    });
});
router.get('/:id', function(req, res) {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            res.send(user);
        })
        .catch(e => {
            console.log(e);
        });
});
router.patch('/:id', function(req, res) {
    let body = _.pick(req.body, ['email', 'nameFirst', 'nameLast']);
    let id = req.params.id;
    User.findByIdAndUpdate(id, body)
        .then(user => {
            res.send(user);
        })
        .catch(e => {
            console.log(e);
        });
});

router.get('/me', authenticate, function(req, res) {
    res.send(req.user);
});

router.post('/login', function(req, res) {
    let body = _.pick(req.body, ['email', 'password']);
    console.log(body);
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

router.delete('/logout', authenticate, function(req, res) {
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
