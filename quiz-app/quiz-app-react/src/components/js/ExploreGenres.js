import React, { Component } from 'react';
import '../css/Component.css'
import '../css/Explore.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class ExploreGenres extends Component {
  constructor() {
    super();
    this.state = {
      genres: []
    }
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") != "true")
    {
      window.location = "/login/"
    }
    else
    {
      fetch('http://localhost:8080/explore/', {
        method: 'GET'
      })
        .then(response => response.json())
          .then(genres => this.setState({genres: genres}));
    }
  }

  render() {
    return (
      <div className="container component-container">
        <div className="card-columns">
          {this.state.genres.length > 0 && this.state.genres.map(function(item) {
            return(
              <Link to={'/explore/' + item.name} className="custom-card">
                <div key={item.name} className="card text-white bg-info mb-3 text-center">
                  <div class="text-center h1">
                    <p className="card-text explore-card-text">{item.name}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {this.state.genres.length == 0 &&
          <div className="text-center display-4">
            <br/>
            <p>Warm up your brain!<br/>Quizzes coming your way!</p>
          </div>
        }
        <footer className="fixed-bottom">
          <div className="row add-genre-button">
            <div className="col-sm-4"></div>
            {this.state.genres.length == 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-4">
                <Link to={'/create/genre'} className="btn btn-success btn-block btn-lg">Add Genre</Link>
              </div>
            }
            {this.state.genres.length > 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-2">
                <Link to={'/create/genre'} className="btn btn-success btn-block btn-lg">Add Genre</Link>
              </div>
            }
            {this.state.genres.length > 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-2">
                <Link to={'/delete/genre'} className="btn btn-danger btn-block btn-lg">Remove Genre</Link>
              </div>
            }
            <div className="col-sm-4"></div>
          </div>
        </footer>
      </div>
    );
  }
}

export default ExploreGenres;
