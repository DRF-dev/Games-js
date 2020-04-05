import React from 'react'
import { Link } from 'react-router-dom'

interface lesProps {
    inscription:String,
    connexion:String,
    chat:String
}

class Navigation extends React.Component<lesProps>{
    render(){
        const { inscription, connexion, chat } = this.props
        return(
            <nav className="navbar navbar-light bg-light">
                <div className="row w-100">
                    <div className="col-4">
                        <Link to="/" className="navbar-brand h1 text-decoration-none text-secondary">Liste de jeux</Link>
                    </div>
                    <div className="col-4 offset-4">
                        <ul className="navbar-nav">
                            <li className="nav-item d-flex flex-column flex-md-row w-100 justify-content-around">
                                <Link to="/inscription" className={"nav-link "+ inscription}>Inscription</Link>
                                <Link to="/connexion" className={"nav-link "+ connexion}>Connexion</Link>
                                <Link to="/chat" className={"nav-link "+ chat}>Chat</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navigation