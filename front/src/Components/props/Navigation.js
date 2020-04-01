import React from 'react'
import { Link } from 'react-router-dom'

class Navigation extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-light bg-light">
                <Link to="/" className="navbar-item h3 text-decoration-none text-secondary">Liste de jeux</Link>
            </nav>
        )
    }
}

export default Navigation