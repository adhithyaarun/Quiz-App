import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Logout extends Component {
  componentDidMount() {
    sessionStorage.clear();
    window.location = "/login/";
  }

  render() {
    return (
      <div className="container">
        <p className="h3 text-center">Logging you out...</p>
      </div>
    );
  }
}

export default Logout;
