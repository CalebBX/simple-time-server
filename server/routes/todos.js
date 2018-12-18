var _ = require('lodash');
var express = require('express');
var router = express.Router();
const { authenticate } = require('../middleware/authenticate.js');
const { Todo } = require('../models/todo');
const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose.js');

router.post('/', authenticate, function(req, res) {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then(
        function(doc) {
            res.send(doc);
        },
        function(e) {
            res.status(400).send(e);
        }
    );
});

router.get('/', authenticate, function(req, res) {
    Todo.find({ _creator: req.user._id }).then(
        function(todos) {
            res.send({ todos });
        },
        function(e) {
            res.status(400).send(e);
        }
    );
});

router.get('/:id', authenticate, function(req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
        .then(function(todo) {
            if (!todo) {
                res.status(404).send();
            }
            res.send({ todo });
        })
        .catch(function(e) {
            res.status(400).send();
        });
});

router.delete('/:id', authenticate, function(req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send;
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    })
        .then(function(todo) {
            if (!todo) {
                res.status(404).send();
            }
            res.send({ todo });
        })
        .catch(function(e) {
            res.status(400).send();
        });
});

router.patch('/:id', authenticate, function(req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        res.status(404).send;
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate(
        {
            _id: id,
            _creator: req.user._id
        },
        { $set: body },
        { new: true }
    )
        .then(function(todo) {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });
        })
        .catch(function(e) {
            res.status(400).send();
        });
});

module.exports = router;
