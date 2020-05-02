const router = require('express').Router();
let Equipe = require('../models/equipe.model');
let User = require('../models/user.model');
let Projet = require('../models/event.model');

router.route('/').get((req, res) => {
  Equipe.find().populate('membres')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const nomEquipe = req.body.nomEquipe;
  const choixSujet = req.body.choixSujet;
  var membres = [];
  User.find({'_id': { $in : 
    req.body.idMembre
  }
  })
  .then(membre => {console.log('your id='+membre._id);
  	membres=membre;
  	const newEquipe = new Equipe({nomEquipe,membres,choixSujet});

  newEquipe.save()
    .then(equipe => res.json(equipe.populate('membres')))
    .catch(err => res.status(400).json('Error: ' + err));
  	}).catch(err=>console.log(err));

  
});
router.route('/addSujets').post((req, res) => {
  const choixSujet = req.body.choixSujet;
  Equipe.findById(req.body.id).then(equipe => {equipe.choixSujet=choixSujet;
    equipe.save().then(eq => res.json(equipe.populate('membres').populate('choixSujet')))
  }).catch(err => res.status(400).json('Error: ' + err));
  
});

router.route('/former/aleatoire/:classe').post((req, res) => {
  var nomEquipes = [];
  var j=0;
  var lastIteration=true; //variable qui va me permetre de modifier le nombre max de membres d'equipe une seule fois
  var firstIteration=true;
  var nbrMaxChanged=false; //variable qui servira à ajuster le nbrEquipeMax une seule fois
  var nbrEtudiant=0;
  User.countDocuments({classe:req.params.classe}).then( count=> {
  nbrEtudiant=count; // On calcule combien on a d'etudiant dans une classe donnée
  console.log("your count"+count);
}).catch('');
  const idProjet= req.body.idProjet; // on recupere l'id du projet
  var arrayEquipe=[];
  const arrayRes=[];
  console.log("nbrEtudiant="+nbrEtudiant);
  Projet.findById(req.body.idProjet)
  .then(project=> {
  	var nbrEquipeMax=project.projet.nbrEquipeMax; //on recupere le nombre max de membre par equipe
  	var rest = nbrEtudiant % nbrEquipeMax; // on calcule le reste de la division du nombre d'etudiants par le nombre max de membres d'equipe
  	var nbrEquipeReduit=nbrEquipeMax-rest; // cette variable nous donne combien on aura besoin d'equipe reduite composée par (nbrEquipeMax-1) pour
  											// Ajuster la division. 
  											// Exemple: pour un nombre d'etudiant= 10 et un nombre max d'equipe=4 =>
  											//on aura besoin de 4-2= 2 equipes composée de 3 membres et le reste des equipes composée par 4 
  											// (dans cet exemple on aura qu'une seule equipe).
  	//Par la suite on aura trois cas : 1: on a pas d'etudiant restant donc on procede à la repartition sans aucun problème
  	if(rest == 0){ // 
  		console.log("rest=0");
  		User.find({classe:req.params.classe}) // on recupere les etudiants qui appartiennent à une classe donnée
  		.then(users=>{				
  			while(users.length!=0){ // puisque on a encore des etudiants dans la liste users
  				console.log("rest=0 "+users.length);
  				nomEquipes[j]="Equipe "+j; // ici on attribut le nom d'equipe qui va etre formé en partant par "Equipe 0",puis "Equipe 1"...etc
  				for(var i=0;i<nbrEquipeMax;i++){ 
  					var removedItem = users.splice(Math.floor(Math.random() * users.length), 1); //ici on choisit un etudiant de liste aleatoirement
  					arrayEquipe.push(removedItem[0]._id); //on ajoute son _id a un array
  				}
  				// l insertion dans la base nécessite des variables de meme nom que celle declarés dans le modele (je ne sais pas pourquoi) 
  				var nomEquipe=nomEquipes[j]; // le nom d'equipe qu'on va inserer 
  				var membres=arrayEquipe; // les membre qu'on va attribuer a l'equipe
  				var newEquipe = new Equipe({nomEquipe,membres}); // declaration du modele
  				//arrayRes=arrayRes.concat(arrayEquipe);
  				newEquipe.save()	// on enregistre l'equipe dans la BD
  				.then(equipe=>{ equipe.populate('membres');})
			    .catch(err => res.status(400).json('Error: ' + err));
			    membres=[]; // on reinitialise la variable membres
			    arrayEquipe=[]; // on reinitialise la variable arrayEquipe
			    arrayRes.push(newEquipe); // on ajoute l'equipe a un tableau qui va etre envoyé par la suite comme un resultat Json
			    j++; // on incremente le j
  			}
  			Equipe.populate(arrayRes,{ path: 'membres'}).then(equipes=>{res.json(equipes)}); // une fois terminer on envoie notre resultat final
  		})
  		.catch(err => res.status(400).json('Error: ' + err));
  	}
  	else{
  		//2ème cas: le nombre d'etudiant restant respecte un taux minimum acceptable pour la formation d'equipe
  		// exemples: pour des equipes de 4 membres on ne tolere pas un groupe de moins de 3 membres (3/4=0.75)
  		//pour des equipe de 5 : 4/5=0.8 => acceptable, 3/5=0.6 => NON ...etc
  		if((rest/nbrEquipeMax)>= 0.75){
  			console.log("rest>=0.75");
  		User.find({classe:req.params.classe})
  		.then(users=>{
  			while(users.length!=0){
  				// on va procéder de la meme façon on forme des groupes de [nbrMax] membres et le dernier groupe sera formé par [nbrMax-1] membres
  				console.log("rest=0 "+users.length);
  				nomEquipes[j]="Equipe "+j;
  				for(var i=0;i<nbrEquipeMax;i++){
  					var removedItem = users.splice(Math.floor(Math.random() * users.length), 1);
  					arrayEquipe.push(removedItem[0]._id);
  					if(i==(nbrEquipeMax-1) && users.length<nbrEquipeMax && lastIteration){ // lorsqu'on arrive a la dernière iteration de la formation du dernier
  					// groupe composé par [nbrMax] membres (condition i==(nbrEquipeMax-1)) && la liste restante < nbrMax
  						nbrEquipeMax=users.length; // on ajuste le nbrEquipeMax
  						lastIteration=false; // on modifie la variable pour qu'on ne modifie plus le nbrMax
  					}
  				}
  				var nomEquipe=nomEquipes[j];
  				var membres=arrayEquipe;
  				var newEquipe = new Equipe({nomEquipe,membres});
  				//arrayRes=arrayRes.concat(arrayEquipe);
  				newEquipe.save()
			    .catch(err => res.status(400).json('Error: ' + err));
			    membres=[];
			    arrayEquipe=[];
			    arrayRes.push(newEquipe);
			    j++;
  			}
  			console.log('envoyer json');
  			Equipe.populate(arrayRes,{ path: 'membres'}).then(equipes=>{res.json(equipes)});
  		})
  		.catch(err => res.status(400).json('Error: ' + err));
  	}
  	else{
  		//3ème cas: les etudiants restant ne peuvent pas etre formé un groupe donc on va reduire des equipes pour qu'on puisse faire la repartition
  		console.log("rest<=0.75");
  		User.find({classe:req.params.classe})
  		.then(users=>{
  			while(users.length!=0){
  				console.log("rest=0 "+users.length);
  				// avant de proceder a la division on doit verifier si on peut formé [nbrEquipeReduit] equipes de [nbrEquipeMax-1] ou pas
  				if((nbrEquipeReduit*(nbrEquipeMax-1))>users.length && firstIteration){ // si on ne peut pas
  					console.log('La formation des equipes ne peut etre fait car '+users.length+' ne peut pas etre reparti en des groupes de '
  						+nbrEquipeMax+' et des '+(nbrEquipeMax-1)+
  						'.Veuillez modifier le nombre des membres max par equipe.');
  					//on suggere de faire diminuer le nbrEquipeMax par 1 et de réessayez de faire la repartition
  					console.log('Suggestion: Essayez de remplacer le nombre max par equipe '+nbrEquipeMax+' par '+(nbrEquipeMax-1)+' et réessayez.');
  					break;
  				}
  				else{ // sinon on procede a la repartition
	  				nomEquipes[j]="Equipe "+j;
	  				if(users.length<=(nbrEquipeReduit*(nbrEquipeMax-1)) && !nbrMaxChanged){ //si le nombre des etudiants= nombre d'etudiants qui seront formé par [nbrMax-1]
	  					nbrEquipeMax=nbrEquipeMax-1; // on ajuste le nbrEquipeMax
	  					nbrMaxChanged=true; // pour ne plus modifier la nbrEquipeMax
	  					console.log('nouveau max='+nbrEquipeMax);
	  				}
	  				for(var i=0;i<nbrEquipeMax;i++){
	  					var removedItem = users.splice(Math.floor(Math.random() * users.length), 1);
	  					arrayEquipe.push(removedItem[0]._id);
	  				}
	  				var nomEquipe=nomEquipes[j];
	  				var membres=arrayEquipe;
	  				var newEquipe = new Equipe({nomEquipe,membres});
	  				newEquipe.save()
				    .catch(err => res.status(400).json('Error: ' + err));
				    membres=[];
				    arrayEquipe=[];
				    arrayRes.push(newEquipe);
				    j++;
				    if(firstIteration){ 
				    	firstIteration=false; //on change la valeur de firstIteration en false apres la première iteration
				    }
  				}
  			}
  			console.log('envoyer json');
  			Equipe.populate(arrayRes,{ path: 'membres'}).then(equipes=>{res.json(equipes)});
  		})
  		.catch(err => res.status(400).json('Error: ' + err));
  	}
  	}
  })
  
});

router.route('/:id').get((req, res) => {
  Equipe.findById(req.params.id)
    .then(equipe => res.json(equipe))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Equipe.findByIdAndDelete(req.params.id)
    .then(() => res.json('Equipe deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/permute').post((req, res) => {
     
     const result=[];
    Equipe.findById(req.body.key[0])
    .then(equipe => {
      for(var x of req.body.valeur1){
        equipe.membres.splice(equipe.membres.indexOf(x),1);
      }
      equipe.membres.push(req.body.valeur2);
      //equipe.description = req.body.description;
      result.push(equipe);
      equipe.save()
        .then(() => console.log('equipe 1 updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    }).then(() => {Equipe.findById(req.body.key[1])
    .then(equipe => {
      for(var y of req.body.valeur2){
        equipe.membres.splice(equipe.membres.indexOf(y),1);
      }
      equipe.membres.push(req.body.valeur1);
      result.push(equipe);
      //equipe.description = req.body.description;

      equipe.save()
        .then(() => Equipe.populate(result,{ path: 'membres'}).then(equipes => res.json(equipes)))
        .catch(err => res.status(400).json('Error: ' + err));
    })})
    .catch(err => res.status(400).json('Error: ' + err));

  
});

router.route('/update/:id').post((req, res) => {
  Equipe.findById(req.params.id)
    .then(equipe => {
      equipe.nomEquipe = req.body.nomEquipe;
      //equipe.description = req.body.description;

      equipe.save()
        .then(() => res.json('Equipe updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/equipes/:classe').get((req, res) => {

  Equipe.find().populate('choixSujet').populate('membres',null,{classe: req.params.classe})
    .then(equipe => res.json(equipe))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;