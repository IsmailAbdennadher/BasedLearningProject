const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    nom : {type : String , trim : true},
    classe : {type : String , default : null},
    equipe : {type: Schema.Types.ObjectId, ref: 'Equipe'}
});

const User = mongoose.model('User', userSchema);

module.exports = User;