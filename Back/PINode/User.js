const mongoose = require('mongoose')

const UserSchema =new mongoose.Schema({
	
	nom:String
})

mongoose.model("user",UserSchema)