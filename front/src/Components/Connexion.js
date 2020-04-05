import React from 'react'
import axios from 'axios'

import Navigation from './props/Navigation'

class Connexion extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            mail: "",
            mdp: ""
        }
    }

    formulaire = ()=>{
        const connexion = {
            mail: this.state.mail,
            mdp: this.state.mdp
        }
        axios.get("http://localhost/user/co", connexion)
        .then(res=>{
            console.log(res.data)
        })
        .catch(err=> console.log(err))
    }

    render(){
        console.log(this.state)
        return(
            <div style={{overflow: 'hidden'}}>
                <Navigation connexion="active disabled" style={{index: -1}}/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center mb-3">
                        <h1>Connexion</h1>
                    </div>
                    <form className="col-12 mb-5" onSubmit={(e)=>{this.formulaire(e)}}>
                        <div className="row">
                            <div className="col-12 d-flex flex-column align-items-center">
                                <div className="form-group w-50">
                                    <label htmlFor="nom">Nom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre mail" onChange={(e)=>this.setState({...this.state, mail: e.target.value})} value={this.state.nom}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="prenom">Prénom</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre mot de passe" onChange={(e)=>this.setState({...this.state, mdp: e.target.value})} value={this.state.prenom}/>
                                </div>
                                <button type="submit" className="btn btn-outline-success" data-toggle="button" aria-pressed="false" autoComplete="off">Envoyer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Connexion