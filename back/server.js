//Nos modules
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const sockets = require('socket.io')
require('dotenv').config()// A l'air d'être utile pour se connecter en tant qu'utilisateur

const app = express()
const schema = mongoose.Schema;

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
app.use((req, res, next) => { //parce que app.use(cors()) ne marche pas tout le temps
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.json())

//Base de donnée
const db = "mongodb+srv://DRF:0614012176Df99@cluster0-ybmru.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
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

const bcrypt = require('bcrypt')

router.route('/user/add').post(async (req, res)=>{
    bcrypt.hash(req.body.mdp, 10)
    .then(hash=>{
        const newUser = new user({
            ...req.body,
            mdp: hash
        })
        newUser.save()
        .then(()=> res.status(200).json({message: "utilisateur créé avec succès"}))
        .catch(error=> res.status(500).json(error))
    })
    .catch(error=> res.status(501).json({error}))
})

router.route('/user/all').get(async(req, res)=>{
    user.find()
    .then(users=> res.status(200).json(users))
    .catch(err=> res.status(500).json(err))
})

const jwt = require('jsonwebtoken')

router.route('/user/co').post((req, res)=>{
    user.findOne({ mail: req.body.mail})
    .then(utilisateur=>{
        if (!utilisateur) {
            return res.status(400).json({ message: "Utilisateur inexistant" })
        }
        bcrypt.compare(req.body.mdp, utilisateur.mdp)
        .then(valid=>{
            if (!valid) {
                return res.status(400).json("Mot de passe incorrect")
            }
            res.status(200).json({
                userId: utilisateur._id,
                token: jwt.sign(
                    { userId: utilisateur._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
    })
    .catch(err=>res.status(500).json(err))
})

//Schema chat
const chatSchema = new schema({
    pseudo: String,
    message: String
},{timestamps: true})
let chat = mongoose.model("chat", chatSchema)

router.route("/chat/add").post(async(req, res)=>{
    const newMess = new chat(req.body)
    newMess.save()
    .then(()=>res.status(200).json({ mess: "Message enrengistré" }))
    .catch(err=> res.status(500).json(err))
})
router.route('/chat/all').get((req, res)=>{
    chat.find()
    .then((messages)=> {
        if (messages.length > 10) {
            let array = []
            for (let i = messages.length - 1; i > messages.length - 10; i--) {
                array.unshift(messages[i])
            }
            console.log(array)
            return res.status(200).json(array) 
        }
        return res.status(200).json(messages) 
    })
    .catch(err=>res.status(500).json(err))
})

const http = require('http')
const serveur = http.createServer(app)
const io = sockets(serveur)

let tempReel;
io.sockets.on("connection", (socket)=>{
    socket.on("listeMessage", (elm)=>{ 
        tempReel = elm  
        socket.emit("TempReel", tempReel)
        socket.broadcast.emit("TempReel", tempReel)
    })
})

//Le serveur écoute le port 4000
const port = process.env.PORT || 4000;
serveur.listen(port, ()=>{ console.log(`Le serveur fonctionne sur le port ${port}`)})
