const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const nom = req.body.nom;
  const classe = req.body.classe;
  const newUser = new User({nom,classe});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addMultiple').post((req, res) => {
	for(const element in req.body){
		for(const e in element){
			const nom = e.nom;
		  const classe = e.classe;
		  const newUser = new User({nom,classe});

  newUser.save()
    .then(() => res.json('User added!'));
		}
	}
});

module.exports = router;