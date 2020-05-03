import React from 'react'
import axios from 'axios'
import CSS from "csstype"
import { connect } from "react-redux"

import Navigation from './props/Navigation'

interface states{
    mail: string,
    mdp: string,
    utilisateur?:string
}

class Connexion extends React.Component<{dispatch:any},states>{

    constructor(props:any){
        super(props)
        this.state = {
            mail: "",
            mdp: "",
            utilisateur:null
        }
    }

    componentDidUpdate =()=>{
        this._envoiStateGlobal()
    }

    _envoiStateGlobal = () => {
        const action = { type: 'user', value: this.state.utilisateur}
        this.props.dispatch(action)
    }

    formulaire = (e:any)=>{
        e.preventDefault()
        const connexion = {
            mail: this.state.mail,
            mdp: this.state.mdp
        }
        axios.post("http://localhost:4000/user/co", connexion)
        .then(res=>{
            this.setState({...this.state, utilisateur: res.data.userId})
            this._envoiStateGlobal()
        })
        .catch(err=> console.log(err))
    }

    render(){
        const navStyle: CSS.Properties = {
            zIndex: -1
        }
        return(
            <div style={{overflow: 'hidden'}}>
                <div style={navStyle}>
                    <Navigation connexion="active disabled"/>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center mb-3">
                        <h1>Connexion</h1>
                    </div>
                    <form className="col-12 mb-5" onSubmit={(e)=>{this.formulaire(e)}}>
                        <div className="row">
                            <div className="col-12 d-flex flex-column align-items-center">
                                <div className="form-group w-50">
                                    <label htmlFor="nom">Adresse mail</label>
                                    <input type="text" className="form-control" placeholder="Entrez votre mail" onChange={(e)=>this.setState({...this.state, mail: e.target.value})} value={this.state.mail}/>
                                </div>
                                <div className="form-group w-50">
                                    <label htmlFor="prenom">Password</label>
                                    <input type="password" className="form-control" placeholder="Entrez votre mot de passe" onChange={(e)=>this.setState({...this.state, mdp: e.target.value})} value={this.state.mdp}/>
                                </div>
                                <button type="submit" className="btn btn-outline-success" /* data-toggle="button" aria-pressed="false" autoComplete="off" */>Envoyer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state.user)
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Connexion)