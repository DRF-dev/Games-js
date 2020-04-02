//Nos modules
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()// A l'air d'être utile pour se connecter en tant qu'utilisateur

const app = express()
const schema = mongoose.Schema;

//Le serveur écoute le port 4000
//const port = process.env.PORT;
const port = 4000;
app.listen(port, ()=>{ console.log(`Le serveur fonctionne sur le port ${port}`)})

//Element basique de sécurité
const helmet = require('helmet') //Protège des faille de sécurité basique comme la faille XSS
const rateLimit = require('express-rate-limit') //Limite le nombre de requete http qu'une adresse IP peut faire sur une durée déterminé
const morgan = require('morgan') //Permet d'enrengistrer une demande même si le serveur plante
const cors = require('cors') 

app.use(helmet())
const limiter = rateLimit({
    windowMs: 15*60*1000, //1000 milliseconde * 60 = 1 minute; 1min*15 = 15min
    max: 100
})
app.use(limiter)
app.use(morgan('common'))
app.use(cors())
app.use(bodyParser.json())

//Base de donnée
const db = "mongodb+srv://DRF:0614012176Df99@cluster0-ybmru.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log('Base de donnée connecté'))
    .catch(err => console.log(err))

//Notre Schema
let jeuxVideo = new schema({
    name: { type: String, required: 'Ecrivez le nom de votre jeux' },
    proprio: String,
    neuf: Boolean
})
let game = mongoose.model('game', jeuxVideo)

//Nos routes
const router = express.Router()
app.use('/', router)

router.route('/jeux').get((req, res)=>{
    game.find((err, games)=>{
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        }
        res.status(200).json(games)
    })
})
router.route('/jeux/add').post((req, res)=>{
    let newGame = new game(req.body)
    newGame.save()
        .then(()=>{
            console.log('Sauvegarde réussi')
            res.status(200).json('Sauvegarde réussi')
        })
        .catch(err=>{
            res.status(400).json(err),
            console.log(err)
        })
})
router.route('/jeux/view/:id').get((req, res)=>{
    game.findById(req.params.id, (err, jeu)=>{
        if (err) {
            return res.json(err)
        }
        res.status(200).json(jeu)
    })
})
/* router.route('/jeux/modif/:id').put((req, res)=>{
    const modif = {
        name: 'Element modifié',
        scoreMax: 2000,
        proprio: 'Machin'
    }
    game.updateOne({ _id: req.params.id}, { ...modif, _id: req.params.id })
        .then(()=>res.status(200).json('Element modifié'))
        .catch(err=>res.status(400).json(err))
}) */
router.route('/jeux/delete/:id').delete((req, res)=>{
    game.findByIdAndDelete({ _id: req.params.id})
    .then(()=>res.status(200).json('Element supprimé'))
    .catch((err)=>res.status(400).json(err))
})

//Schema inscription
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new schema({
    nom: String,
    prenom: String,
    age: Number,
    mail: {type: String, unique: true},
    mdp: String
},{timestamps: true})
userSchema.plugin(uniqueValidator)
let user = mongoose.model("user", userSchema)

router.route('/user/add').post(async (req, res)=>{
    const newUser = new user(req.body)
    newUser.save()
    .then(()=>{
        console.log('Sauvegarde réussi')
        res.status(200).json('Sauvegarde réussi')
    })
    .catch(err=>{
        res.status(400).json(err),
        console.log(err)
    })
})