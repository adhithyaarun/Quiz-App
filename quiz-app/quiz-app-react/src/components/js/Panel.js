import React, { Component } from 'react';
import '../css/Component.css'
import '../css/Explore.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Panel extends Component {

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      ;
    }
    else
    {
      window.location = "/login/";
    }
  }

  render() {
    return (
      <div className="container component-container">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Link to={'/create/genre'} className="custom-card">
            <div className="card text-white bg-info mb-3 text-center">
              <div class="text-center h1">
                <p className="card-text explore-card-text">Create Genre</p>
              </div>
            </div>
          </Link>

          <Link to={'/delete/genre'} className="custom-card">
            <div className="card text-white bg-info mb-3 text-center">
              <div class="text-center h1">
                <p className="card-text explore-card-text">Delete Genre</p>
              </div>
            </div>
          </Link>
      </div>
    );
  }
}

export default Panel;
