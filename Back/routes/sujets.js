const router = require('express').Router();
let Sujet = require('../models/sujet.model');
let Equipe = require('../models/equipe.model');
const arrayJson=[];
router.route('/').get((req, res) => {
  Sujet.find().populate('porteur_projet').populate('equipes')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:id').get((req, res) => {
  Sujet.findById(req.params.id).populate('porteur_projet').populate('equipes')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/sujets/acceptee').get((req, res) => {
  Sujet.find({accepte:1}).populate('porteur_projet').populate('equipes')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const titre = req.body.titre;
  const description =req.body.description;
  const type = req.body.type;
  const nbrEquipeParProjet = req.body.nbrEquipeParProjet;
  const porteur_projet = req.body.porteur_projet;
  //const equipes:[{type: Schema.Types.ObjectId, ref: 'Equipe'}]

  const newSujet = new Sujet({titre,description,type,porteur_projet,nbrEquipeParProjet});

  newSujet.save()
    .then(sujet => res.json(sujet))
    .catch(err => res.status(400).json('Error: ' + err));
});

function delay() {
  // `delay` returns a promise
  return new Promise(function(resolve, reject) {
    // Only `delay` is able to resolve or reject the promise
    setTimeout(function() {
      resolve(42); // After 1 seconds, resolve the promise with value 42
    }, 1000);
  });
}
async function getAllSujets(listeEquipes,res) {
  try {
  	console.log('test');
    
  var array=[];
  for (var e of listeEquipes) {
	  	await getEquipe(e);
  		}
    // wait for 3 seconds (just for the sake of this example)
    await delay();
    // GET information about each book
    //console.log('votre tableau est '+arrayJson);
    //res.json(arrayJson);
    return arrayJson;
  } catch(error) {
    // If any of the awaited promises was rejected, this catch block
    // would catch the rejection reason
    return null;
  }
}
async function getEquipe(e){
		return await Equipe.findById(e).then(equipes=>{ 
			foo(equipes);});
		//return c;
}
 async function foo(equipes){
 	//console.log('Json'+arrayJson);
  		await arrayJson.push(equipes);
  	}
  	function findEquipeIndice(myArray,id){

  		for(var i = 0; i < myArray.length; i++) {
		   if(myArray[i]._id == id) {
		     return i;
		   }
		}
  	}
  	function MaxTab(myArray){
  		var max=1;
  		for(var x in myArray) {
		   if(myArray[x]>max) {
		     max=myArray[x];
		   }
		}
		return max;
  	}

  	function getEquipesIdWithHighIndex(myArray,myArray2){
  		arrayReturn=[];
  		if(MaxTab(myArray2)>1){
  			for(var i of myArray ) {
			   if( myArray2[i]==MaxTab(myArray2)) {
			   	console.log('ii='+i);
			     arrayReturn.push(myArray.indexOf(i));
			   }
		}
		return arrayReturn;
  		}
  		else
  			return -1;
  	}

	  
router.route('/affecter/aleatoire').post(async function(req, res){
  const listeEquipes = req.body.listEquipes; //pour le moment on va juste tester l'algorithme
  var array=[];
  var arraySujets=[];
  var arrayIndiceChoix=[];
  const arrayRestant=[];
  array=await getAllSujets(listeEquipes,res);
  var j=0;
  var breakLoop=false;
  while(!breakLoop){
  for (var i = 0; i < array.length; i++) {
  	var a = array[i]['choixSujet'][j];
  	var e = array[i]['_id'];
  	console.log('aa= '+a);
  	if(!arraySujets[a]){
  		arraySujets[a]=[];
  	}
  	if(!arrayIndiceChoix[e]){
  		arrayIndiceChoix[e]=[];
  	}
  	arraySujets[a].push(array[i]['_id']);
  	arrayIndiceChoix[e]=j+1;
  	console.log('tableau sujets '+arraySujets[a]);
  }
  
  for(var s in arraySujets){
  	console.log('index de tableau sujets '+s );
  	await Sujet.findById(s)
  	.then(sujet=>{
  		while(sujet.nbrEquipeParProjet<arraySujets[sujet._id].length){
  			if(getEquipesIdWithHighIndex(arraySujets[sujet._id],arrayIndiceChoix)==-1){
  				arrayRestant.push(arraySujets[sujet._id].splice(Math.floor(Math.random() * arraySujets[sujet._id].length), 1));
  				console.log('ici');
  			}
  			else{
  				var cc=getEquipesIdWithHighIndex(arraySujets[sujet._id],arrayIndiceChoix);
  				//cc[Math.floor(Math.random() * cc.length)] random value mel tableau cc
  				arrayRestant.push(arraySujets[sujet._id].splice(cc[Math.floor(Math.random() * cc.length)], 1)); //supprimer un element
  				console.log('here'+cc);
  			}
  		}
  		//ici lezem tsauvegardi kol sujet lel equipe mte3ou (reste a tester en cas de conflit 2ème cas)
  		for(var id of arraySujets[sujet._id]){
  			//console.log('index='+findEquipeIndice(array,id)); //HERE you delete array[findEquipe]
  			if(findEquipeIndice(array,id)!=undefined){
  				array.splice(findEquipeIndice(array,id),1);
  			}
  		}
  		//delete arraySujets[sujet_id];
  		//console.log('nombre permis='+sujet.nbrEquipeParProjet);
  		//console.log('nouveau element de '+sujet._id+" est "+arraySujets[sujet._id]);
  		//console.log('test de var'+arraySujets[sujet._id]);
  		})
  	.catch(err => console.log(err));
  	}
  		j++;
  	console.log('restant '+arrayRestant);
  	for (var i in arraySujets) {
  		console.log('tableau sujets '+arraySujets[i]);
  	}
  	//console.log('tableau sujets '+arraySujets);
  	console.log('array = '+array);
  	if(array.length==0){
  		breakLoop=true;
  	}
  }
  const resultats=[];
  for (var i in arraySujets) {
    if(arraySujets[i].length==1){
      await Equipe.findById(arraySujets[i]).then((equipe) => {
        equipe.sujet=i;
        resultats.push(equipe);
        equipe.save().then((equipe) => console.log(equipe.nomEquipe+" : "+equipe.sujet))
      })
    }
    else{
      for(var x of arraySujets[i]){
        await Equipe.findById(x).then((equipe) => {
        equipe.sujet=i;
        resultats.push(equipe);
        equipe.save().then((equipe) => console.log(equipe.nomEquipe+" : "+equipe.sujet))
      })
      }
    }
    }
  Equipe.populate(resultats,[{path:'choixSujet'},{path:'sujet'}]).then((equipes) => res.json(equipes));
  	//console.log('element de l index ='+arraySujets[s]);
  	//console.log('count='+arraySujets[s].length);
  arrayJson.length=0;
  
  
});

router.route('/update/:id').post((req, res) => {
  Sujet.findById(req.params.id)
    .then(sujet => {
      sujet.titre = req.body.titre;
      sujet.description = req.body.description;
      sujet.type = req.body.type;
      sujet.porteur_projet = req.body.porteur_projet;
      sujet.equipes = req.body.equipes;
      sujet.nbrEquipeParProjet = req.body.nbrEquipeParProjet;
      sujet.save()
        .then(sjt => res.json(sjt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/accepter/:id').post((req, res) => {
  Sujet.findById(req.params.id)
    .then(sujet => {
      sujet.accepte = true;

      sujet.save()
        .then(sjt => res.json(sjt))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Sujet.findByIdAndDelete(req.params.id)
    .then(() => res.json('Sujet deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;