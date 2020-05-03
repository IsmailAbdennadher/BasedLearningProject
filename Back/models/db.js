const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/piNode').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});