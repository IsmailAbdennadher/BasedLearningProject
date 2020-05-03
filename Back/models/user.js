var mongoose = require('mongoose');
var competance = new mongoose.Schema({
    "nom" : {type : String},
    "UE" : {type : Number},


},{ _id : false });

var roles = new mongoose.Schema({
    "nom" : {type : String},
    "date" : {type : Date},

},{ _id : false });


var userSchema = new mongoose.Schema({
    nom : {type : String , trim : true},
    prenom : {type : String},
    adresse : {type : String},
    email : {type : String , required : true},
    password : {type:String , required : true, minlength: 3},
    role : [roles],
    classe : {type : String , default : null},
    profession: {type : String , default : null},
    competances : [competance],
    isActif : {type : Boolean, default:true},
    sexe : {type : String , default : "autre"},
    universite : {type : String , default : null},
    diplome : {type : String , default : null},
    industrie : {type : String , default : null},
    occupation : {type : String , default : null},
    aPropos : {type : String , default : "pas d'information."},
    experience : {type : Number , default : 0},
    groupe : [Object],
    competencesRecherche : [String]


});

module.exports = mongoose.model('User',userSchema);