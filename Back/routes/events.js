const router = require('express').Router();
let Event = require('../models/event.model');

router.route('/').get((req, res) => {
  Event.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/projets').get((req, res) => {
  Event.find({ projet :  {$exists : true} })
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/projet/:classe').get((req, res) => {
  Event.findOne({ 'projet.niveau_concerne':req.params.classe })
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Event.findById(req.params.id).populate('projet.sujets')
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


router.route('/projets/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
       event.nom = req.body.nom;
   event.event_parent=req.body.event_parent;
   event.categorie= req.body.categorie;
   event.description= req.body.description;
   event.dateDebut= req.body.dateDebut;
   event.dateFin= req.body.dateFin;
   //event.type= req.body.type;
   event.nbrPlace= Number(req.body.nbrPlace);
   event.lieu= req.body.lieu;
    event.projet.nom=req.body.projet.nom;
    event.projet.niveau_concerne= req.body.projet.niveau_concerne;
    event.projet.nbrEquipeMax= Number(req.body.projet.nbrEquipeMax);
    event.projet.anneeScolaire=req.body.projet.anneeScolaire;

      event.save()
        .then(evt => res.json(evt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/projets/:id/addtopics').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      for(var x of req.body.topics){
       event.projet.sujets.push(x);
      }

      event.save()
        .then(evt => res.json(evt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/projets/:id/removetopic').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      event.projet.sujets.splice(event.projet.sujets.indexOf(req.body.removedtopic),1);

      event.save()
        .then(evt => res.json(evt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json('Projet deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;