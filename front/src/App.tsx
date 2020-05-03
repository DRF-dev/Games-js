import React from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import Liste from './Components/Liste'
import Detail from './Components/Detail'
import Inscription from './Components/Inscription'
import NotFound from './Components/NotFound'
import Connexion from './Components/Connexion'
import Chat from "./Components/Chat"

import { Provider } from 'react-redux'
import Store from "./Store/configureStore"

class App extends React.Component{
  render(){
    return(
      <Provider store={Store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Liste}/>
            <Route path="/game/:id" component={Detail}/>
            <Route exact path="/inscription" component={Inscription}/>
            <Route exact path="/connexion" component={Connexion}/>
            <Route exact path="/chat" component={Chat}/>
            <Route exact path="/404" component={NotFound}/>
            <Redirect to="/404"/>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
