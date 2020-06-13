const express =require ('express')
const app= express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require ('multer');
const crypto = require ('crypto');
const path = require('path');
require('./Evenement')
const cors = require('cors');
require('./User')
app.use(bodyParser.json())
app.use(cors())
const Evenement= mongoose.model("evenement")
const User= mongoose.model("user")

const mongoUri = "mongodb+srv://cnq:psnpH36yczhrgNkI@cluster0-no6m5.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
	
	useNewUrlParser:true,
	useUnifiedTopology:true
	
})

mongoose.connection.on("connected",()=>{
	
	console.log("connected to mongo yeah")
})

mongoose.connection.on("error",(err)=>{
	
	console.log("error",err)
})

//file upload

const storage = multer.diskStorage({
	
	destination:'./upload/',
	filename:function(req,file,callback){
		
		crypto.pseudoRandomBytes(16,function(err,raw){
			
			if (err) return callback(err);
			callback(null,raw.toString('hex')+ path.extname(file.originalname));
			
		});
		
	}
	
	
});

const upload = multer({storage:storage});

app.post('/file',upload.single('blogimage'),(req,res)=>{
	
	res.status(201).send({fileName:req.file.filename,file:req.file});
})

app.get('/liste',(req,res)=>{
	Evenement.find({}).then(data=>{
		res.send(data)
	})
	.catch(err=>{
		 console.log(err)
		 
	 })
	
})
 app.post('/send-data',(req,res)=>{
	 
	 const evenement =new Evenement({
		 nom:req.body.nom,
		 type:req.body.type,
		 nombrePlace:req.body.nombrePlace,
		 description:req.body.description,
		 categorie:req.body.categorie,
		 lieu:req.body.lieu,
		  dateEvent:req.body.dateEvent
		 
	 })
	 evenement.save()
	 .then(data=>{
		 console.log(data)
		  res.send(data)
	 }).catch(err=>{
		 console.log(err)
		 
	 })
	
 
 })
 
 app.post('/delete',(req,res)=>{
	 
	 Evenement.findByIdAndRemove(req.body.id)
	 .then(data=>{
		 console.log(data)
		 res.send(data)
	 }).catch(err=>{
		 console.log(err)
		 
	 })
	 
 })
 
 app.post('/update/:id',(req,res)=>{
	 
	  Evenement.findByIdAndUpdate(req.params.id,{
		   nom:req.body.nom,
		 type:req.body.type,
		 nombrePlace:req.body.nombrePlace,
		 description:req.body.description,
		 categorie:req.body.categorie,
		 lieu:req.body.lieu,
		  dateEvent:req.body.dateEvent
	  }).then(data=>{
		  console.log(data)
		  res.send(data)
	  })
	  .catch(err=>{
		 console.log(err)
		 
	 })
	 
 })
 
 
 app.get('/api',(req,res)=>{
	  Evenement.find()
	  .sort({'dateEvent': -1})
	  .exec()
	  .then(Evenement=>res.status(200).json(Evenement))
	  .catch(err=>res.status(500).json({
		  
		  message: 'events not found:(',
		  error:err
		  
	  }));
	 
	 
 });

/* app.post('/send',(req,res)=>{
	 
	 console.log(req.body)
	 res.send("posted")
 
 })
*/
/* " nom":"req.body.nom",
	     "type":"req.body.type",
		 "nombrePlace":"req.body.nombrePlace",
		 "description":"req.body.description",
		 "categorie":"req.body.categorie",
		 "lieu":"req.body.lieu",
		  "dateEvent":"req.body.dateEvent"
		  */
		  

		 app.delete('/delete/:id',(req, res, next) => {
			Evenement.findByIdAndRemove(req.params.id, (error, data) => {
			  if (error) {
				return next(error);
			  } else {
				res.status(200).json({
				  msg: data
				})
			  }
			})

		})

		app.get('/res/:id', function(req, res, next) {
			
		  
			var ddd ={};
			console.log()
			
			Evenement.find({"_id":req.params.id},{},function(e,docs){
			  ddd =docs;
			  console.log("tst1 ",docs.nom);
			  console.log("tst2",docs[0].nom);
			  var a={
				nom:  docs[0].nom,
				type:  docs[0].type
				,description:  docs[0].description,
				categorie: docs[0].categorie,
				lieu: docs[0].lieu
				,dateEvent: docs[0].dateEvent,
				
				nombrePlace: docs[0].nombrePlace-1,
			  }
			  
			  Evenement.findOneAndUpdate({"_id":req.params.id}, a, function(err) { // 5
				if(err) {
				  console.log("test3",docs)
				  console.log("tst4",docs[0]);
					return res.send(500, err);
				}
		  
				res.json(a);
			});
			  
		  });
			   
			});
			app.post('/part/:id', async (req, res, next) => {
				const idEvent = req.params.id;
				const idUser = req.body._id;
				
				User.findById(idUser)
					.exec()
					.then(userDoc => {
						console.log(userDoc)
						Evenement.findOne({
							"_id":idEvent,
							"participators":userDoc
							
						}).exec()
						.then(doc=>{
							if(doc==null && userDoc!=null){
								Evenement.updateOne({
									_id: idEvent
								}, {
									$push: {
										participators: userDoc
									}
								})
								.exec()
								.then(doc => {
									res.status(200).json(0)
								})
								.catch(err => {
									res.status(500).json(err);
								})
							}else
								res.status(200).json(1)
						})
					})
					.catch(err => {
						res.status(500).json({
							message: "could not find"
						})
					});
			});

			app.post('/modif/:id',(req, res) => {
				Evenement.findById(req.params.id)
				  .then(evenement => {
					evenement.nom=req.body.nom;
		            evenement.type=req.body.type;
					evenement.nombrePlace=req.body.nombrePlace;
					evenement.description=req.body.description;
					evenement.categorie=req.body.categorie;
					evenement.lieu=req.body.lieu;
					evenement.dateEvent=req.body.dateEvent;
					evenement.save()
					  .then(sjt => res.json(sjt))
					  .catch(err => res.status(400).json('Error: ' + err));
				  })
				  .catch(err => res.status(400).json('Error: ' + err));
			  });
			  app.get('/event/:id',(req, res) => {
				Evenement.findById(req.params.id)
				  .then(data => res.json(data))
				  .catch(err => res.status(400).json('Error: ' + err));
			  });
			  
app.listen(5000,()=>{
	
	console.log("server runing")
})
		  