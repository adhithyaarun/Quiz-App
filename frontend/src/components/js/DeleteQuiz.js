import React, { Component } from 'react';
import '../css/DeleteQuiz.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class DeleteQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        genre: null
      },
      quizzes: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      fetch('http://localhost:8080/explore/' + this.props.match.params.genre, {
        method: 'GET'
      })
        .then(response => response.json())
          .then(quizzes => {
            this.setState({quizzes: quizzes});
            if(this.state.quizzes.length > 0)
            {
              this.setState({
                formData: {
                  name: String(quizzes[0].name),
                  genre: Number(quizzes[0].genre)
                }
              });
            }
          });
    }
    else
    {
      window.location = "/login/";
    }
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/delete/quiz/' + this.props.match.params.genre, {
      method: 'DELETE',
      body: JSON.stringify(this.state.formData),
    })
    .then(response => {
      if(response.status == 200) {
        this.setState({
          formData:{
            name: "",
            genre: this.state.formData.genre
          }
        });
        window.location = "/explore";
      }
      else if(response.status == 404)
      {
        this.setState({
          formData:{
            name: "",
            genre: this.state.formData.genre
          }
        });
      }
    });
  }

  handleNameChange (event) {
    this.setState({
      formData: {
        name: String(event.target.value),
        genre: this.state.formData.genre
      }
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.quizzes.length > 0 &&
          <p className="display-3 text-center remove-quiz-heading">Remove Quiz</p>
        }
        {this.state.quizzes.length == 0 &&
          <div className="text-center display-4">
            <br/>
            <p>No quizzes to delete.</p>
          </div>
        }
        {this.state.quizzes.length > 0 &&
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <div className="col-sm-3"></div>
              <div className="col-sm-4">
                {this.state.quizzes.length > 0 &&
                  <select className="form-control" value={this.state.formData.name} onChange={this.handleNameChange} required>
                    {this.state.quizzes.length > 0 && this.state.quizzes.map((item) => {
                        return (
                            <option key={item.id} value={item.name}>{item.name}</option>
                        );
                      })
                    }
                  </select>
                }
              </div>
              <div className="col-sm-2">
                <button type="submit" className="btn btn-danger btn-block">Remove</button>
              </div>
              <div className="col-sm-3"></div>
            </div>
          </form>
        }
      </div>
    );
  }
}

export default DeleteQuiz;
