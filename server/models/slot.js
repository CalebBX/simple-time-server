const mongoose = require('mongoose');

let Slot = mongoose.model('Slot', {
    start: {
        type: Date,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }

});

module.exports = { Slot };