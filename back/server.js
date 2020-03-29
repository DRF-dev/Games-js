//Nos modules
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const schema = mongoose.Schema;

app.use(cors())
app.use(bodyParser.json())

//Le serveur écoute le port 4000
const port = 4000;
app.listen(port, ()=>{ console.log(`Le serveur fonctionne sur le port ${port}`)})

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
/* router.route('/jeux/view/:id').get((req, res)=>{
    game.findById(req.params.id, (err, jeu)=>{
        if (err) {
            return res.json(err)
        }
        res.status(200).json(jeu)
    })
}) */
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
    game.deleteOne({ _id: req.params.id})
    .then(()=>res.status(200).json('Element supprimé'))
    .catch((err)=>res.status(400).json(err))
})