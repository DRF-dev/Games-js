import React from 'react'
import axios from 'axios'

export default class Liste extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            nosJeux:[],
            objetEnCours:{
                name: '',
                proprio: '',
                neuf: false
            }
        }
    }

    //S'active dès que la page est chargé
    componentDidMount = ()=>{
        this.getAll()
    }

    //Va aller cherchez tous nos jeux
    getAll = ()=>{
        axios.get('http://localhost:4000/jeux')
        .then(res=>{
            this.setState({ nosJeux: res.data })
        })
    }

    changeJeu = (e)=>{
        const etat = this.state;
        this.setState({
            ...etat.nosJeux,
            objetEnCours:{
                ...etat.objetEnCours,
                name: e.target.value
            }
        })
    }
    changeProprio = (e)=>{
        const etat = this.state;
        this.setState({
            ...etat,
            objetEnCours:{
                ...etat.objetEnCours,
                proprio: e.target.value
            }
        })
    }

    check = (e)=>{
        const checkTrue = document.getElementById('checkTrue')
        const checkFalse = document.getElementById('checkFalse')
        const etat = this.state;

        if (checkTrue !== null && checkFalse !== null) {
            if (checkTrue.checked && !checkFalse.checked) {
                this.setState({
                    ...etat,
                    objetEnCours:{
                        ...etat.objetEnCours,
                        neuf: true
                    }
                })
            }
            else if (!checkTrue.checked && checkFalse.checked) {
                this.setState({
                    ...etat,
                    objetEnCours:{
                        ...etat.objetEnCours,
                        neuf: false
                    }
                })
            }
        }
    }

    form = (e)=>{
        if (this.state.objetEnCours.name === '' || this.state.objetEnCours.proprio === '') {
            return alert('Un des champs est incomplet')
        }
        const newGame = {
            name: this.state.objetEnCours.name,
            proprio: this.state.objetEnCours.proprio,
            neuf: this.state.objetEnCours.neuf
        }
        axios.post('http://localhost:4000/jeux/add', newGame)
        .then(res=>{
            console.log('Succès')
            this.getAll()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    suppression = (key)=>{
        const confirmation = window.confirm(`Voulez-vous vraiment supprimer l'élément ${key.name} ?`);
        if (confirmation) {
            axios.delete(`http://localhost:4000/jeux/delete/${key._id}`, key)
            .then(()=>{
                console.log('Suppression réussi')
                this.getAll()
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    render(){ 
        return(
            <div>
                <nav className="navbar navbar-light bg-light">
                    <h1 className="navbar-item h4">Liste de jeux</h1>
                </nav>
                <div className="container">
                    <div className="row m-3">
                        <div className="col-12 col-md-5 mb-5 mb-md-0">
                            <h2 className="h3">Ajouter un jeu à la liste</h2>
                            <form onSubmit={(e)=>this.form(e)}>
                                <div className="form-group">
                                    <label htmlFor="name">Nom du jeu :</label>
                                    <input type="text" name="name" className="form-control" placeholder="Assassin's creed" onChange={(e)=>this.changeJeu(e)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Nom du propriétaire :</label>
                                    <input type="text" name="name" className="form-control" placeholder="Jean-louis la nuit" onChange={(e)=>this.changeProprio(e)}/>
                                </div>
                                <div className="form-group">
                                    <p className="h6">Le jeu est-il neuf ?</p>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" name="etat" value="true" className="form-check-input" id="checkTrue" onChange={(e)=>this.check(e)}/>Oui
                                        </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" name="etat" value="false" className="form-check-input" id="checkFalse" onChange={(e)=>this.check(e)} defaultChecked/>Non
                                        </label>
                                    </div>
                                </div>
                                <button type="submit">Envoyer</button>
                            </form>
                        </div>
                        <div className="col-12 col-md-6 ml-md-5">
                            <h2 className="h3">Nos jeux</h2>
                            <div className="list-group-flush">
                                {this.state.nosJeux.map(item=>{
                                    return(
                                        <article className="list-group-item" key={item._id}>
                                            <div className="row">
                                                <div className="col-10">
                                                    <h3>{item.name}</h3>
                                                    <p>Jeu appartenant à {item.proprio}</p>
                                                    <p>{item.neuf === true?"Le jeu est disponible neuf":"Le jeu est disponible en occasion"}</p>
                                                </div>
                                                <div className="col-2 d-flex h-50 position-relative" style={{top:25}}>
                                                    <button className="btn-lg btn-outline-danger my-2 my-sm-0" onClick={()=>this.suppression(item)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}