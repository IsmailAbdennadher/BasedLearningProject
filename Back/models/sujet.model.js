const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sujetSchema = new Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String },
  accepte: { type: Boolean, default: false },
  equipes:[{type: Schema.Types.ObjectId, ref: 'Equipe'}],
  porteur_projet:{type: Schema.Types.ObjectId, ref: 'User'},
  nbrEquipeParProjet:{ type: Number, default: 1 }
});

const Sujet = mongoose.model('Sujet', sujetSchema);

module.exports = Sujet;