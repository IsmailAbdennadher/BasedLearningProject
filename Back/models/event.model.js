const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  nom: { type: String, required: true },
  event_parent: {type: Schema.Types.ObjectId, ref: 'Event', default:null},
  categorie: { type: String },
  description: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  type: { type: String },
  nbrPlace: { type: Number },
  lieu: { type: String },
  projet: {
  	nom: { type: String, required: true },
  	niveau_concerne: { type: String, required: true },
  	nbrEquipeMax: { type: Number, required: true },
  	anneeScolaire: { type: String, required: true },
  	methodologie: { type: String },
  	sujets:[{type: Schema.Types.ObjectId, ref: 'Sujet'}],
  	tuteurs:[{type: Schema.Types.ObjectId, ref: 'User'}]
  }
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;