import React from 'react'
import axios from 'axios'

import Navigation from './props/Navigation'

class Inscription extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            verif: {
                nom: "",
                prenom: "",
                age: "",
                mail: "",
                mdp: "",
                confirmation: ""
            }
        }
    }

    quitteElement = (e)=>{
        if (e.target.value === "") {
            return e.target.className = "form-control is-invalid"
        }
        return e.target.className = "form-control is-valid"
    }

    changeNom = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                nom: e.target.value
            }
        })
    }

    changePrenom = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                prenom: e.target.value
            }
        })
    }

    changeAge = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                age: parseInt(e.target.value)
            }
        })
    }

    quitteAge = (e)=>{
        const converToNumber = parseInt(e.target.value)
        if (!isNaN(converToNumber)) {
            if (converToNumber > 0) {
                return this.quitteElement(e)
            }
        }
        return e.target.className = "form-control is-invalid"
    }

    changeMail = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                mail: e.target.value
            }
        })
    }

    quitteMail = (e)=>{
        const emailReg = new RegExp(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i); 
        const valid = emailReg.test(e.target.value);   
        if (valid) {
            return this.quitteElement(e)
        }
        return e.target.className = "form-control is-invalid"
    }

    changemdp = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                mdp: e.target.value
            }
        })
    }

    changeConfirm = (e)=>{
        this.setState({
            verif: {
                ...this.state.verif,
                confirmation: e.target.value
            }
        })
    }

    quittemdp = (e)=>{
        const password = document.getElementById("password")
        const confirm = document.getElementById("confirm")
        if (this.state.verif.mdp === this.state.verif.confirmation) {
            if (this.state.verif.mdp !== "") {
                password.classList.remove("is-invalid")
                password.classList.add("is-valid")
                confirm.classList.remove("is-invalid")
                return confirm.classList.add("is-valid")
            }
        }
        password.classList.remove("is-valid")
        password.classList.add("is-invalid")
        confirm.classList.remove("is-valid")
        confirm.classList.add("is-invalid")
    }

    formulaire = ()=>{
        const name = document.getElementById("name")
        const prenom = document.getElementById("prenom")
        const age = document.getElementById("age")
        const mail = document.getElementById("mail")
        const password = document.getElementById("password")
        const confirm = document.getElementById("confirm")

        if(name.className === "form-control is-valid" &&
        prenom.className === "form-control is-valid" &&
        age.className === "form-control is-valid" &&
        mail.className === "form-control is-valid" &&
        password.className === "form-control is-valid" &&
        confirm.className === "form-control is-valid"
        ){
            const newUser = {
                nom: this.state.verif.nom,
                prenom: this.state.verif.prenom,
                age: this.state.verif.age,
                mail: this.state.verif.mail,
                mdp: this.state.verif.confirmation
            }
            axios.post("http://localhost:4000/user/add", newUser)
            .then(()=>{ console.log('sauvegarde réussi') })
            .catch(err=> console.log(err), mail.classList.replace('is-valid', 'is-invalid'))
        } else {
            alert("Un des élément manque à l'appel")
        }
    }

    render(){
        return(
            <div style={{overflow: 'hidden'}}>
                <Navigation inscription="active disabled"/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center mb-3">
                        <h1>Inscription</h1>
                    </div>
                    <form className="col-12 mb-5" onSubmit={(e)=>{this.formulaire()}}>
                        <div className="row">
                            <div className="col-4 offset-3">
                                <div className="form-group w-50">
                                    <label htmlFor="nom">Nom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre nom" id="name" onChange={(e)=>this.changeNom(e)} onBlur={(e)=>this.quitteElement(e)}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="prenom">Prénom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre prenom" id="prenom" onChange={(e)=>this.changePrenom(e)} onBlur={(e)=>this.quitteElement(e)}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="age">Age</label>
                                    <input type="number" className="form-control" placeholder="Entrez votre age" id="age" min={1} max={150} onChange={(e)=>this.changeAge(e)} onBlur={(e)=>this.quitteAge(e)}/>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group w-50">
                                    <label htmlFor="mail">Mail</label>
                                    <input type="email" className="form-control" placeholder="Entrez votre adresse mail" id="mail" onChange={(e)=>this.changeMail(e)} onBlur={(e)=>this.quitteMail(e)}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input type="password" className="form-control" placeholder="Entrez votre mot de passe" onChange={(e)=>this.changemdp(e)} onBlur={()=>this.quittemdp()} id="password"/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="confirmMDP">Confirmation</label>
                                    <input type="password" className="form-control" placeholder="Confirmez votre mot de passe" onChange={(e)=>this.changeConfirm(e)} onBlur={()=>this.quittemdp()} id="confirm"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center">
                                <button type="submit" className="btn btn-outline-success" data-toggle="button" aria-pressed="false" autoComplete="off">Envoyer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Inscription