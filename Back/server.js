const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var test = require('./api/test.js');
//var db = require('./models/db');
var passport = require('passport');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
const equipesRouter = require('./routes/equipes');
const sujetsRouter = require('./routes/sujets');

app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/equipes', equipesRouter);
app.use('/sujets', sujetsRouter);
app.use('/test', test);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});