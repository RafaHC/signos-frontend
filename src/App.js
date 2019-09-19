import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Ascendente from './pages/Ascendente';
import './App.css';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" name="Login" exact component={Login} />
          <Route path="/Home" name="Home" component={Home} />
          <Route path="/Registro" name="Registro" component={Registro} />
          <Route path="/Ascendente" name="Ascendente" component={Ascendente} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
