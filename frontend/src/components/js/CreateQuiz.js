import React, { Component } from 'react';
import '../css/CreateQuiz.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class CreateQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        genre: null
      },
      error: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      fetch('http://localhost:8080/genre/' + this.props.match.params.genre, {
      method: 'GET'
    })
      .then(response => response.json())
        .then(genre => this.setState(
          {
            formData: {
              name: "",
              genre: genre.id
            }
          }
        )
      );
    }
    else
    {
      window.location = "/login/";
    }
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/create/quiz/' + this.props.match.params.genre, {
      method: 'POST',
      body: JSON.stringify(this.state.formData),
    })
    .then(response => {
      if(response.status == 200) {
        this.setState({
          formData:{
            name: "",
            genre: this.state.formData.genre
          },
          error: ""
        });
        window.location = "/explore/" + this.props.match.params.genre;
      }
      else if(response.status == 400)
      {
        this.setState({
          formData:{
            name: "",
            genre: this.state.formData.genre
          },
          error: "A quiz already has this name"
        });
      }
    });
  }

  handleNameChange (event) {
    this.setState({
      formData: {
        name: event.target.value,
        genre: this.state.formData.genre
      }
    });
  }

  render() {
    return (
      <div className="container">
        <p className="display-3 text-center add-quiz-heading">Add Quiz</p>
        <form onSubmit={this.handleSubmit}>
          {this.state.error &&
            <div className="row">
              <div className="col-sm-3"></div>
              <div className="col-sm-6">
                <div className="text-center alert alert-danger">
                    <span>
                      {this.state.error}
                    </span>
                </div>
              </div>
              <div className="col-sm-3"></div>
            </div>
          }
          <div className="form-group row">
            <div className="col-sm-3"></div>
            <div className="col-sm-4">
              <input type="text" className="form-control" value={this.state.formData.name} onChange={this.handleNameChange} required/>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-success btn-block">Add</button>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateQuiz;
