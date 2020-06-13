const mongoose = require('mongoose')

const EvenementSchema =new mongoose.Schema({
	
	nom:String,
	type:String,
	dateEvent:String,
	nombrePlace:String,
	description:String,
	lieu:String,
	categorie:String,
	participators:[{}],
	
	
})

mongoose.model("evenement",EvenementSchema)