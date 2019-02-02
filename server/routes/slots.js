let _ = require('lodash');
let express = require('express');
let router = express.Router();
const { authenticate } = require('../middleware/authenticate.js');
const { Slot } = require('../models/slot');
const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose.js');

router.get('/', authenticate, function (req, res) {
    Slot.find({ _user: req.body.userId }).then(
        function (slots) {
            res.send({ slots });
        },
        function (e) {
            res.status(400).send(e);
        }
    );
});
router.post('/book', authenticate, function (req, res) {
    let slot = new Slot({
        start: req.body.start,
        length: req.body.length,
        _user: req.body.userId
    });
    slot.save().then(
        function (doc) {
            res.send(doc);
        },
        function (e) {
            res.status(400).send(e);
        }
    );
});

module.exports = router;
