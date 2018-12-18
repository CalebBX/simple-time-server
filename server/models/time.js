const mongoose = require('mongoose');

var TimeSchema = new mongoose.Schema({
    clockIn: {
        type: Date,
        required: false
    },
    clockOut: {
        type: Date,
        required: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    minutes: {
        type: Number,
        required: false
    }
});

var Time = mongoose.model('Time', TimeSchema);
module.exports = { Time };
