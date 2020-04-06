import React from 'react'
import axios from 'axios'
import {Properties} from "csstype"

import Navigation from './props/Navigation'

interface states{
    nom: string,
    prenom: string,
    age: string,
    mail: string,
    mdp: string,
    confirmation: string,
    listeMailExistant: any
}

class Inscription extends React.Component<{},states>{

    constructor(props:any){
        super(props)
        this.state = {
            nom: "",
            prenom: "",
            age: "",
            mail: "",
            mdp: "",
            confirmation: "",
            listeMailExistant: []
        }
    }

    listeMailExistant = ()=>{
        axios.get("http://localhost:4000/user/all")
        .then(res=>{
            const data = res.data
            const filtre = data.map((item: { mail: string })=>{
                return item.mail
            })
            this.setState({
                ...this.state,
                listeMailExistant: filtre
            })
        })
        .catch(err=>console.log(err))
    }

    componentDidMount = ()=>{
        this.listeMailExistant()
    }

    messageErreur = (e:any)=>{
        if (e.target.value === '') {
            e.target.classList.remove("is-valid")
            return e.target.classList.add("is-invalid")
        }

        e.target.classList.remove("is-invalid")
        return e.target.classList.add("is-valid")
    }

    messageErreurAge = (e:any)=>{
        const convertToNumber = parseInt(e.target.value)
        const message = document.getElementsByTagName("small")

        if (!isNaN(convertToNumber)) {
            if (convertToNumber >= 18 && convertToNumber < 150) {
                this.messageErreur(e)
                return message[0].style.display = "none"
            }
            e.target.classList.remove("is-valid")
            e.target.classList.add("is-invalid")    
            return message[0].style.display = "block"
        }
        e.target.classList.remove("is-valid")
        e.target.classList.add("is-invalid")   
        return message[0].style.display = "block" 
    }

    messageErreurMail = (e:any)=>{
        const verif = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/)
        const message = document.getElementsByTagName("small")

        if (verif.test(e.target.value)) {
            const mailDejaPris = this.state.listeMailExistant.filter((element:string)=> element === e.target.value)
            if (mailDejaPris.length === 0) {
                message[1].style.display = "none"
                return this.messageErreur(e)
            }
            message[1].style.display = "block"
            e.target.classList.remove("is-valid")
            return e.target.classList.add("is-invalid")        
        }
        e.target.classList.remove("is-valid")
        return e.target.classList.add("is-invalid")    
    }

    verifMdp = (e:any)=>{
        const message = document.getElementsByTagName("small")

        if (e.target.value.length >= 8) {
            message[2].style.display = "none"
            return this.messageErreur(e)
        }
        message[2].style.display = "block"
        e.target.classList.remove("is-valid")
        return e.target.classList.add("is-invalid")    
    }

    confirmMdp = (e:any)=>{
        const message = document.getElementsByTagName("small")

        if (this.state.mdp === this.state.confirmation) {
            message[3].style.display = "none"
            return this.messageErreur(e)
        }
        message[3].style.display = "block"
        e.target.classList.remove("is-valid")
        return e.target.classList.add("is-invalid")    
    }

    formulaire = (e:any)=>{
        e.preventDefault()

        const inputs = document.getElementsByTagName("input")
        const messageSucces:HTMLElement = document.getElementById("messageInscription")

        const echecInscription = (message:string)=>{
            messageSucces.textContent = message
            messageSucces.classList.remove("alert-success")
            messageSucces.classList.add("alert-danger")
            messageSucces.style.display = "block"
            return setTimeout(()=>{
                messageSucces.style.display = "none"
            },2000)
        }

        let elementValide = []
        for (let i = 0; i < inputs.length; i++) {
            const valide = inputs[i].classList.contains("is-valid")
            elementValide.push(valide)
        }

        const check = elementValide.indexOf(false)
        if (check === -1) {
            const newUser = {
                nom: this.state.nom,
                prenom: this.state.prenom,
                age: this.state.age,
                mail: this.state.mail,
                mdp: this.state.mdp
            }
            return axios.post("http://localhost:4000/user/add", newUser)
            .then(res=>{
                console.log(res.data.message)
                this.setState({
                    nom: "",
                    prenom: "",
                    age: "",
                    mail: "",
                    mdp: "",
                    confirmation: "",
                    listeMailExistant: this.state.listeMailExistant
                })
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].classList.remove("is-valid")
                }

                messageSucces.textContent = "Inscription enrengistré avec succès"
                messageSucces.classList.remove("alert-danger")
                messageSucces.classList.add("alert-success")
                messageSucces.style.display = "block"
                setTimeout(()=>{
                    messageSucces.style.display = "none"
                },2000)
                this.listeMailExistant()
            })
            .catch(err=>{
                echecInscription("Erreur serveur")
            })     
        }    
        echecInscription("Echec de l'inscription")
    }

    render(){
        const navStyle: Properties = {
            zIndex: -1
        }
        return(
            <div style={{overflow: 'hidden'}}>
                <div style={navStyle}>
                    <Navigation connexion="" chat="" inscription="active disabled"/>
                </div>                
                <div className="alert" id="messageInscription"></div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center mb-3">
                        <h1>Inscription</h1>
                    </div>
                    <form className="col-12 mb-5" onSubmit={(e)=>{this.formulaire(e)}}>
                        <div className="row">
                            <div className="col-12 col-md-4 offset-md-3">
                                <div className="form-group w-50">
                                    <label htmlFor="nom">Nom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre nom" onChange={(e)=>this.setState({...this.state, nom: e.target.value})} onBlur={(e)=>this.messageErreur(e)} value={this.state.nom}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="prenom">Prénom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre prenom" onChange={(e)=>this.setState({...this.state, prenom: e.target.value})} onBlur={(e)=>this.messageErreur(e)} value={this.state.prenom}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="age">Age</label>
                                    <input type="number" className="form-control" placeholder="Entrez votre age" min={1} max={150} onChange={(e)=>this.setState({...this.state, age: e.target.value})} onBlur={(e)=>this.messageErreurAge(e)} value={this.state.age}/>
                                    <small style={{display: "none"}}>Vous devez être majeur pour vous inscrire</small>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="form-group w-50">
                                    <label htmlFor="mail">Mail</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre adresse mail" onChange={(e)=>this.setState({...this.state, mail: e.target.value})} onBlur={(e)=>this.messageErreurMail(e)} value={this.state.mail}/>
                                    <small style={{display: "none"}}>Ce mail est déjà pris</small>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input type="password" className="form-control" placeholder="Entrez votre mot de passe" onChange={(e)=>this.setState({...this.state, mdp: e.target.value})} onBlur={(e)=>this.verifMdp(e)} value={this.state.mdp}/>
                                    <small style={{display: "none"}}>Votre mot de passe doit faire plus de 8 caratères</small>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="confirmMDP">Confirmation</label>
                                    <input type="password" className="form-control" placeholder="Confirmez votre mot de passe" onChange={(e)=>this.setState({...this.state, confirmation: e.target.value})} onBlur={(e)=>this.confirmMdp(e)} value={this.state.confirmation}/>
                                    <small style={{display: "none"}}>Les mots de passe ne correspondent pas</small>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center">
                                <button type="submit" className="btn btn-outline-success" /* data-toggle="button" aria-pressed="false" autoComplete="off" */>Envoyer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Inscription