var express = require('express')
var router = express.Router();
const app = express()

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");
var User = require('../models/user.js');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require('cookie-session')

var TodayDate = new Date()


let AuthUser = {};
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))


passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});


passport.use(new FacebookStrategy({
        clientID: "549958842313352",
        clientSecret: "21959a12aead92eb47d1f814ee4cb9aa",
        callbackURL: "http://localhost:4000/test/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(JSON.stringify(profile));
        user = { ...profile };
        return cb(null, profile);
    }));

passport.use(new GoogleStrategy({
        clientID: "293192649591-baj299r7n821qdkior8bs08p58av3b6m.apps.googleusercontent.com",
        clientSecret: "6t-hVLJ92laisR3pGecoL_Ig",
        callbackURL: "http://localhost:4000/test/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        return done(null, profile);

    }));
router.get('/home', (req, res) => res.send('Example Home page!'))
router.get('/failed', (req, res) => res.send('You Failed to log in!'))
router.get('/good', (req, res) => {
    User.findOne({email: AuthUser.email}).then(user => {

console.log("74"+ user)
            if (!user) {
                var user = new User({
                    nom: AuthUser.given_name,
                    prenom: AuthUser.family_name,
                    adresse: '',
                    email: AuthUser.email,
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(10)),
                    role: [{nom:"apprenant",date:TodayDate.setMonth(TodayDate.getMonth()+1)}],
                    classe: null,
                    profession: req.body.profession,
                    competances:req.body.competances,
                    isActif: req.body.isActif,
                    sexe:   req.body.sexe,
                    occupation: req.body.occupation,
                    industrie: req.body.industrie,
                    universite : req.body.universite,
                    diplome : req.body.diplome,
                    experience : req.body.experience,
                    aPropos:req.body.aPropos,
                    groupe : [],
                    competencesRecherche:[]


                });
                user.save((err, user) => {
                    if (err) res.json(err);
                    else
                        console.log("good")
                        res.writeHead(301,
                            {Location: 'http://localhost:3000/GoogleLogin'}
                        );

                    res.end();
                });
            } else {  console.log("notGood")
                res.writeHead(301,
                    {Location: 'http://localhost:3000/GoogleLogin'}
                );

                res.end();
            }



    });

})
router.get("/auth/google", passport.authenticate("google",  { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/test/failed' }),
    function(req, res) {

AuthUser=req.user._json
        console.log(AuthUser)
        res.redirect('/test/good');
    }
);
router.get('/logout', (req, res) => {
    AuthUser = {};
    req.session = null;
    req.logout();
    res.redirect('/');
})

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
        res.send(user);
    });
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
router.post("/",(req,res)=>{
    var user = new User(req.body)
    user.save((err,user)=>{
        if(err) res.json(err);
        else res.json(user);
    })
});

router.get("/",(req,res)=>{
    User.find((err,users)=>{
        if(err) res.json(err)
        else res.json(users)
    })
});


router.post("/register", (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if(req.body.password===undefined|| req.body.password.length < 3)
            res.status(400).json({error: " spécifier votre mot de passe"}).end();
        else{
        if (!user) {
            var user = new User({
                nom: req.body.nom,
                prenom: req.body.prenom,
                adresse: req.body.adresse,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                role: req.body.role,
                classe: req.body.classe,
                profession: req.body.profession,
                competances:req.body.competances,
                isActif: req.body.isActif,
                sexe:   req.body.sexe,
                occupation: req.body.occupation,
                industrie: req.body.industrie,
                universite : req.body.universite,
                diplome : req.body.diplome,
                experience : req.body.experience,
                aPropos:req.body.aPropos,
                groupe : [],
                competencesRecherche:[]


            });
            user.save((err, user) => {
                if (err) res.json(err);
                else res.json(user);
            });
        } else {
            res.json({error: " User already exist"})
        }}


    });

});

router.post('/login', async function (req,res) {
    console.log("hello")
    await User.findOne({email:req.body.email},(err,user)=>{
        if(err) res.json(err);
        if(!user) res.json({error : "User n'existe pas"});
        else {
            if(bcrypt.compareSync(req.body.password,user.password)){
                var token = jwt.sign({user},'secret',{expiresIn:2})
                res.json(token)
            }else{
                res.status(401).json("Mot de passe incorrecte")
            }
        }
    })
})
router.post('/GoogleLogin', async function (req,res) {
    console.log("hello")
    await User.findOne({email:AuthUser.email},(err,user)=>{
        if(err) res.json(err);
        if(!user) res.json({error : "User n'existe pas"});
        else {
                var token = jwt.sign({user},'secret',{expiresIn:2})
                res.json(token)
            console.log(token)


        }
    })
})


router.post('/edit-password',(req,res)=> {
    User.findOneAndUpdate({email: req.body.email}, {$set: {password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.json(doc)
    })
})

router.post('/reset-password',(req,res)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(err) res.json(err);
        if(!user) res.json({error : "User n'existe pas"});
        else {
            newPassword = generator.generate( {
                length: 10,
                uppercase: true,
                numbers : true,
                lowercase: true,
                symbols : false
            });
            newPasswordHashed= bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

            console.log(newPasswordHashed+'    '+newPassword);
            console.log(bcrypt.compareSync(newPassword,newPasswordHashed))

            User.findOneAndUpdate({ email: req.body.email },{$set: { password: newPasswordHashed }}, {new: true}, (err, doc)=>{
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'fatnassiiteb@gmail.com',
                        pass: '24121997'
                    }
                });

                var mailOptions = {
                    from: 'piNode@esprit.com',
                    to: user.email,
                    subject: 'reseting password',
                    text: 'here is your new password ' + newPassword
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }})
                res.json(doc)
            })

        }
    })
});

router.get("/group-by-UE",(req,res)=>{
    var list = [];
    User.find((err,users)=>{
        if(err) res.json(err);
        users.forEach(e=>{
            e.competances.forEach(c=>{
                if(c.nom===req.body.nomCompetance && c.UE < 10) {
                    list.push(e)

                }
            })
        })
        User.findOneAndUpdate({email: req.body.email}, {$set: {groupe:list}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            res.json(doc)
        })

    })

});

router.get("/group-random",(req,res)=>{
    var list = [];
    User.find((err,users)=>{
        if(err) res.json(err);
        for (i = 0; i < 2; i++) {
        var r =Math.ceil(Math.random() * users.length);
        console.log(r);
        list.push(users[r-1]);}
        console.log(list)
        User.findOneAndUpdate({email: req.body.email}, {$set: {groupe:list}}, {new: true}, (err, doc) => {
            if(!doc) res.json({message:"Something wrong when updating data!"})
            else if (err) {
                console.log("Something wrong when updating data!");
            }
            res.json(doc)
        })

    })

});

router.post('/deactivate',(req,res)=> {
    User.findOneAndUpdate({email: req.body.email}, {$set: {isActif:false}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.json(doc)
    })
})

router.post('/activate',(req,res)=> {
    User.findOneAndUpdate({email: req.body.email}, {$set: {isActif:true}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        res.json(doc)
    })
})


router.get("/expired",(req,res)=>{
    var email;
    console.log(new Date()+"  ,  ")
    User.find((err,users)=>{
        if(err) res.json(err)
        else {
            users.forEach(u=>{

                for(i=0;i<u.role.length;i++){
                    if (u.role[i].date< new Date()){
                        u.role.splice(i);

                    }
                }
                var newroles= u.role
                User.findOneAndUpdate({email: u.email}, {$set: {role:newroles}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }

                })
            })
            res.json("modifier avec sucess")
        }
    })
});

router.post('/add-role',(req,res)=> {
    User.findOne({email:req.body.email},(err,user)=>{
        if (err) res.json(err)
        else {
          var roles =   user.role;
          roles.push(req.body.role)
            user.role=roles;
user.save((err, u) => {
    if (err) res.json(err);
    else res.json(u);
});


        }})

        })


router.post('/delete',(req,res)=> {
    User.findOne({email:req.body.email},(err,user)=>{
        if (!user) res.json({message: "user n'existe pas"})
else{
            User.deleteOne({email: req.body.email}, function (err) {
                if (err) res.send(err);
                else res.json({message: "sucess"})
            });}
        })

})

router.put('/edit',(req,res)=>{
    User.findOne({email:req.body.email},(err,user)=> {
        if (!user) res.json({message: "user n'existe pas"})
        else {
            User.findOneAndUpdate({email: req.body.email}, req.body, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }, function (error, user) {
                if (error) {
                    console.log("Something wrong when updating data!");
                }
                console.log(user)
                var token = jwt.sign({user},'secret',{expiresIn:2})
                res.json(token);
            });
        }
    })
})

router.post('/edit-competences',(req,res)=> {
    User.findOneAndUpdate({email: req.body.email}, {$set: {competances: req.body.comps}}, {new: true}, (err, user) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        var token = jwt.sign({user},'secret',{expiresIn:2})
        res.json(token)
    })
})


module.exports = router;
