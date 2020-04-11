const router = require('express').Router();
let Event = require('../models/event.model');

router.route('/').get((req, res) => {
  Event.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const nom = req.body.nom;
  const event_parent=req.body.event_parent;
  const categorie= req.body.categorie;
  const description= req.body.description;
  const dateDebut= Date.parse(req.body.dateDebut);
  const dateFin= Date.parse(req.body.dateFin);
  const type= req.body.type;
  const nbrPlace= Number(req.body.nbrPlace);
  const lieu= req.body.lieu;
  var projet={};
  	projet.nom=req.body.projet.nom;
  	projet.niveau_concerne= req.body.projet.niveau_concerne;
  	projet.nbrEquipeMax= Number(req.body.projet.nbrEquipeMax);
  	projet.anneeScolaire=req.body.projet.anneeScolaire;
  	projet.methodologie=req.body.projet.methodologie;
  	//sujets:[{type: Schema.Types.ObjectId, ref: 'Sujet'}]
  

  const newEvent = new Event({nom,event_parent,categorie,description,dateDebut,dateFin,type,nbrPlace,lieu,projet});

  newEvent.save()
    .then(event => res.json(event))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      event.username = req.body.username;
      event.description = req.body.description;

      event.save()
        .then(evt => res.json(evt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;