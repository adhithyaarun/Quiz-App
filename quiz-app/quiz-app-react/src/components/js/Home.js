import React, { Component } from 'react';
import '../css/Component.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div className="container text-center component-container">
        {sessionStorage.getItem("authenticated") != "true" &&
          <div>
            <br></br>
            <br></br>
            <p className="display-2 text-center">Welcome to Quiz World!</p>
            <p className="display-3 text-center">Up for some quizzing?</p>
            <p className="display-4 text-center">Then you're at the right place!</p>
            <br></br>
            <br></br>
            <div className="row component-container">
              <div className="col-sm-2"></div>
              <div className="col-sm-3">
                <Link to={'/login/'} className="btn btn-primary btn-block btn-lg"><strong className="h3">Login</strong></Link>
              </div>
              <div className="col-sm-2"></div>
              <div className="col-sm-3">
                <Link to={'/signup/'} className="btn btn-success btn-block btn-lg"><strong className="h3">Sign Up</strong></Link>
              </div>
              <div className="col-sm-2"></div>
            </div>
          </div>
        }
        {sessionStorage.getItem("authenticated") == "true" &&
          <div>
            <br></br>
            <br></br>
            <p className="display-2 text-center">Welcome to Quiz World!</p>
            <br></br>
            <p className="display-3 text-center">Start quizzing NOW!</p>
            <br></br>
            <br></br>
            <div className="row component-container">
              <div className="col-sm-4"></div>
              <div className="col-sm-4">
                <Link to={'/explore/'} className="btn btn-primary btn-block btn-lg"><strong className="h3">Explore</strong></Link>
              </div>
              <div className="col-sm-4"></div>
            </div>
          </div>
        }
    </div>
    );
  }
}

export default Home;
