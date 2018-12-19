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
    },
    active: {
        type: Boolean,
        required: true
    }
});

var Time = mongoose.model('Time', TimeSchema);
module.exports = { Time };
