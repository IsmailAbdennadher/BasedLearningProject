const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});