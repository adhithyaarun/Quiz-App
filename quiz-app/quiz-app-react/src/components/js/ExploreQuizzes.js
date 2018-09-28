import React, { Component } from 'react';
import '../css/Component.css'
import '../css/Explore.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class ExploreQuizzes extends Component {
  constructor() {
    super();
    this.state = {
      quizzes: []
    }
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true")
    {
      fetch('http://localhost:8080/explore/' + this.props.match.params.genre, {
        method: 'GET'
      })
        .then(response => response.json())
          .then(quizzes => this.setState({quizzes: quizzes}));
    }
    else
    {
      window.location = "/login/";
    }
  }

  render() {
    return (
      <div className="container component-container">

        <div className="card-columns">
          {this.state.quizzes.length > 0 && this.state.quizzes.map(function(item) {
            return(
              <Link to={'/quiz/' + item.id} className="custom-card">
                <div key={item.name} className="card text-white bg-info mb-3 text-center">
                  <div className="h3 card-text explore-card-text">
                    {item.name}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {this.state.quizzes.length == 0 &&
          <div className="text-center display-4">
            <br/>
            <p>Get Ready!<br/>{this.props.match.params.genre} quizzes coming soon!</p>
          </div>
        }
        <footer className="fixed-bottom">
          <div className="row add-quiz-button">
            <div className="col-sm-4"></div>
            {this.state.quizzes.length == 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-4">
                <Link to={'/create/quiz/' + this.props.match.params.genre} className="btn btn-lg btn-block btn-success">Add Quiz</Link>
              </div>
            }
            {this.state.quizzes.length > 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-2">
                <Link to={'/create/quiz/' + this.props.match.params.genre} className="btn btn-lg btn-block btn-success">Add Quiz</Link>
              </div>
            }
            {this.state.quizzes.length > 0 && sessionStorage.getItem("admin") == "true" &&
              <div className="col-sm-2">
                <Link to={'/delete/quiz/' + this.props.match.params.genre} className="btn btn-lg btn-block btn-danger">Remove Quiz</Link>
              </div>
            }
            <div className="col-sm-4"></div>
          </div>
        </footer>
      </div>
    );
  }
}

export default ExploreQuizzes;
