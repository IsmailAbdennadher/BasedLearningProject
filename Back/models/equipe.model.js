const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const equipeSchema = new Schema({
  nomEquipe: { type: String, required: true },
  //sujet:{type: Schema.Types.ObjectId, ref: 'Sujet'},
  choixSujet:[{type: Schema.Types.ObjectId, ref: 'Sujet'}],
  membres:[{type: Schema.Types.ObjectId, ref: 'User'}],
  tuteur:{type: Schema.Types.ObjectId, ref: 'User'}
});

const Equipe = mongoose.model('Equipe', equipeSchema);

module.exports = Equipe;