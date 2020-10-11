var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/userRoutes');
const levelsRouter = require('./routes/levelRoutes');
const usersRouter = require('./routes/userRoutes')

require('dotenv').config();
const mongoose = require('mongoose');
var app = express();
const ErrorHelper = require('./helpers/errorHelper');
const winston = require('winston')
winston.add(new winston.transports.File({ filename: 'logs/errorLogs.log' }))

mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    "auth": { "authSource": process.env.MONGO_AUTHSOURCE },
    "user": process.env.MONGO_USERNAME,
    "pass": process.env.MONGO_PASSWORD,
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/v1/levels', levelsRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
            
app.use((error, req, res, next) => {
    ErrorHelper.response(error, res);
});

module.exports = app;
