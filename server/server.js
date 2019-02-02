require('./config/config.js');
const _ = require('lodash');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { mongoose } = require('./db/mongoose.js');

const usersRoutes = require('./routes/users');
const todosRoutes = require('./routes/todos');
const slotsRoutes = require('./routes/slots');
const timeRoutes = require('./routes/time');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
//app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'x-auth, Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Expose-Headers', 'x-auth');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');

    next();
});

app.use('/users', usersRoutes);
app.use('/todos', todosRoutes);
app.use('/slots', slotsRoutes);
app.use('/time', timeRoutes);

app.listen(port, function () {
    console.log(`Started at port: ${port}`);
});

module.exports = { app };
