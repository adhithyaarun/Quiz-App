import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Performance extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: 0,
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        scores: [],
        totalscore: 0,
        admin: false
      },
      genres: [],
      quizzes: [],
      chosen: -1
    };
    this.findQuiz = this.findQuiz.bind(this);
    this.findGenre = this.findGenre.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true")
    {
      fetch('http://localhost:8080/performance/' + String(sessionStorage.getItem("id")), {
        method: 'GET'
      })
        .then(response => response.json())
          .then(user => {this.setState({user: user})});

      fetch('http://localhost:8080/explore/', {
        method: 'GET'
      })
        .then(response => response.json())
          .then(genres => {this.setState({genres: genres})});

      fetch('http://localhost:8080/get/quiz/', {
        method: 'GET'
      })
        .then(response => response.json())
          .then(quizzes => {this.setState({quizzes: quizzes})});
    }
    else
    {
      window.location = "/login/";
    }
  }

  findGenre(index){
    for(var i = 0; i < this.state.genres.length; i++)
    {
      if(this.state.genres[i].id == this.state.user.scores[index].genreid)
      {
        return this.state.genres[i].name;
      }
    }
  }

  findQuiz(index){
    for(var i = 0; i < this.state.quizzes.length; i++)
    {
      if(this.state.quizzes[i].id == this.state.user.scores[index].quizid)
      {
        return this.state.quizzes[i].name;
      }
    }
  }



  render() {
    return (
      <div className="container">
        {this.state.user.scores.length > 0 &&
          <p className="display-3 text-center remove-genre-heading">My Performance</p>
        }
        {this.state.user.scores.length == 0 &&
          <div className="text-center display-4">
            <br/>
            <p>You haven't played any quizzes. </p>
            <p>Play some and come back to review your performance</p>
          </div>
        }
        <br></br>
        <br></br>
        {this.state.user.scores.length > 0 &&
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Genre</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {this.state.user.scores.map(function(score, index){
                return(
                  <tr key={index}>
                    <td>{this.findGenre(index)}</td>
                    <td>{this.findQuiz(index)}</td>
                    <td>{score.value}</td>
                    <td>{score.attempts}</td>
                  </tr>
                )
              }, this)}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default Performance;
