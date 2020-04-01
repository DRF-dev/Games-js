import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import Liste from './Components/Liste'
import Detail from './Components/Detail'
import NotFound from './Components/NotFound'

class App extends React.Component{
  render(){
    return(
      <Router>
        <Switch>
          <Route exact path="/" component={Liste}/>
          <Route path="/game/:id" component={Detail}/>
          <Route exact path="/404" component={NotFound}/>
          <Redirect to="/404"/>
        </Switch>
      </Router>
    )
  }
}

export default App;
