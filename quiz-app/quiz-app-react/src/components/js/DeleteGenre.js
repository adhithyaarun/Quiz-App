import React, { Component } from 'react';
import '../css/DeleteGenre.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class DeleteGenre extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: ""
      },
      genres: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      fetch('http://localhost:8080/explore/', {
      method: 'GET'
      })
      .then(response => response.json())
        .then(genres => {
          this.setState({genres: genres});
          if(this.state.genres.length > 0)
          {
            this.setState({
              formData: {
                name: String(genres[0].name)
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
    fetch('http://localhost:8080/delete/genre', {
      method: 'DELETE',
      body: JSON.stringify(this.state.formData),
    })
    .then(response => {
      if(response.status == 200) {
        this.setState({
          formData:{
            name: ""
          }
        });
        window.location = "/explore";
      }
      else if(response.status == 404)
      {
        this.setState({
          formData:{
            name: ""
          }
        });
      }
    });
  }

  handleNameChange (event) {
    this.setState({
      formData: {
        name: String(event.target.value),
      }
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.genres.length > 0 &&
          <p className="display-3 text-center remove-genre-heading">Remove Genre</p>
        }
        {this.state.genres.length == 0 &&
          <div className="text-center display-4">
            <br/>
            <p>No genres to delete.</p>
          </div>
        }
        {this.state.genres.length > 0 &&
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <div className="col-sm-3"></div>
              <div className="col-sm-4">
                {this.state.genres.length > 0 &&
                  <select className="form-control" value={this.state.formData.name} onChange={this.handleNameChange} required>
                    {this.state.genres.length > 0 && this.state.genres.map((item) => {
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

export default DeleteGenre;
