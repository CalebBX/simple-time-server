var _ = require('lodash');
var express = require('express');
var router = express.Router();
const { authenticate } = require('../middleware/authenticate.js');
const { Time } = require('../models/time');
const { ObjectID } = require('mongodb');
const { mongoose } = require('../db/mongoose.js');

router.post('/clockIn', authenticate, function(req, res) {
    var err = false;
    Time.findOne({ active: true }).then(time => {
        if (time) {
            return res.send({
                message: 'Active time entry already exists'
            });
        }
        var time = new Time({
            clockIn: new Date(),
            active: true,
            _creator: req.user._id,
            _employee: req.user._id
        });
        time.save().then(
            function(doc) {
                res.send(doc);
            },
            function(e) {
                res.status(400).send(e);
            }
        );
    });
});
router.post('/clockOut', authenticate, function(req, res) {
    Time.findOne({ active: true })
        .then(time => {
            if (!time) {
                return res.send({
                    message: 'Active time entry must exist to clock out'
                });
            }
            time.clockOut = new Date();
            time.minutes = getMinutes(time.clockIn, time.clockOut);
            time.active = false;
            time.save().then(
                function(doc) {
                    res.send(doc);
                },
                function(e) {
                    res.status(400).send(e);
                }
            );
        })
        .catch(function(e) {
            res.status(400).send();
        });
});
// router.get('/', authenticate, function (req, res) {
//     var id = req.params._employee;
//     if (!ObjectID.isValid(id)) {
//         res.status(404).send;
//     }
//     Time.findOne({ _id: id })
//         .then(function (time) {
//             if (!time) {
//                 return res.status(404).send();
//             }
//             res.send({ time });
//         })
//         .catch(function (e) {
//             res.status(400).send();
//         });
// });
router.get('/:_employee', authenticate, function(req, res) {
    var _employee = req.params._employee;
    if (!ObjectID.isValid(_employee)) {
        res.status(404).send;
    }
    Time.find({ _employee: _employee })
        .then(function(time) {
            if (!time) {
                return res.status(404).send();
            }
            res.send(time);
        })
        .catch(function(e) {
            res.status(400).send();
        });
});
function getMinutes(date1, date2) {
    var ms = Math.abs(date1 - date2);
    var minutes = Math.ceil(ms / 1000 / 60);
    return minutes;
}

module.exports = router;
