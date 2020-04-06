import React from 'react'
import axios from 'axios'


import Navigation from './props/Navigation'
import { RouteComponentProps } from 'react-router'

interface lesStates{
    parametre: any,
    item:any,
}

class Detail extends React.Component<{} & RouteComponentProps,lesStates>{

    constructor(props:any){
        super(props)
        this.state = {
            parametre: (this.props.match.params as any).id,
            item: []
        }
    }

    componentDidMount = ()=>{
        this.jeuActuel()
    }

    jeuActuel = ()=>{
        axios.get('http://localhost:4000/jeux/view/'+this.state.parametre)
        .then(res=>{
            this.setState({
                ...this.state,
                item: res.data
            })
        })
    }

    render(){
        return(
            <div>
                <Navigation inscription="" connexion="" chat=""/>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>{this.state.item.name}</h2>
                        </div>
                        <div className="col-12">
                            <p>Le propriétaire de ce jeu est {this.state.item.proprio}</p>
                        </div>
                        <div className="col-12">
                            <p>{this.state.item.neuf === true?"Le jeu est disponible neuf":"Le jeu est disponible en occasion"}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail