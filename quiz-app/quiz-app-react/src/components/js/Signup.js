import React, { Component } from 'react';
import Login from './Login'
import '../css/Signup.css'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        admin: false,
        repeatpassword: "",
      },
      error: ""
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true")
    {
      window.location = "/";
    }
  }

  handleSubmit (event) {
    event.preventDefault();
    if(this.state.formData.password != this.state.formData.repeatpassword)
    {
      this.setState({
        formData:{
          username: this.state.formData.username,
          password: "",
          firstname: this.state.formData.firstname,
          lastname: this.state.formData.lastname,
          admin: false,
          repeatpassword: ""
        },
        error: "Password and confirmation must be the same"
      });
      this.forceUpdate();
    }
    else
    {
      fetch('http://localhost:8080/signup/', {
        method: 'POST',
        body: JSON.stringify(this.state.formData),
      })
      .then(response => {
        if(response.status == 200) {
          this.setState({
            formData:{
              username: "",
              password: "",
              firstname: "",
              lastname: "",
              admin: false,
              repeatpassword: ""
            },
            error: ""
          });
          window.location = "/login/";
        }
        else if(response.status == 400)
        {
          this.setState({
            formData:{
              username: "",
              password: "",
              firstname: "",
              lastname: "",
              admin: false,
              repeatpassword: ""
            },
            error: "Please provide all details"
          });
        }
      });
    }
  }

  handleUsernameChange (event) {
    this.setState({
      formData: {
        username: event.target.value,
        password: this.state.formData.password,
        firstname: this.state.formData.firstname,
        lastname: this.state.formData.lastname,
        admin: false,
        repeatpassword: this.state.formData.repeatpassword,
      }
    });
  }

  handlePasswordChange (event) {
    this.setState({
      formData: {
        username: this.state.formData.username,
        password: event.target.value,
        firstname: this.state.formData.firstname,
        lastname: this.state.formData.lastname,
        admin: false,
        repeatpassword: this.state.formData.repeatpassword,
      }
    });
  }

  handleRepeatPasswordChange (event) {
    this.setState({
      formData: {
        username: this.state.formData.username,
        password: this.state.formData.password,
        firstname: this.state.formData.firstname,
        lastname: this.state.formData.lastname,
        admin: false,
        repeatpassword: event.target.value,
      }
    });
  }

  handleFirstNameChange (event) {
    this.setState({
      formData: {
        username: this.state.formData.username,
        password: this.state.formData.password,
        firstname: event.target.value,
        lastname: this.state.formData.lastname,
        admin: false,
        repeatpassword: this.state.formData.repeatpassword,
      }
    });
  }

  handleLastNameChange (event) {
    this.setState({
      formData: {
        username: this.state.formData.username,
        password: this.state.formData.password,
        firstname: this.state.formData.firstname,
        lastname: event.target.value,
        admin: false,
        repeatpassword: this.state.formData.repeatpassword,
      }
    });
  }

  render() {
    return (
      <div className="container">
        <p className="display-3 text-center signup-heading">Sign Up</p>
        <form onSubmit={this.handleSubmit}>
          {this.state.error &&
              <div className="alert alert-danger">
                  <span>
                    {this.state.error}
                  </span>
              </div>
          }
          <div className="form-group row">
            <div className="col-sm-6">
              <label><strong>First Name</strong></label>
              <input className="form-control" type="text" value={this.state.formData.firstname} onChange={this.handleFirstNameChange} required></input>
            </div>
            <div className="col-sm-6">
              <label><strong>Last Name</strong></label>
              <input className="form-control" type="text" value={this.state.formData.lastname} onChange={this.handleLastNameChange} required></input>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <label><strong>Username</strong></label>
              <input className="form-control" type="text" value={this.state.formData.username} onChange={this.handleUsernameChange} required></input>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-6">
              <label><strong>Password</strong></label>
              <input className="form-control" type="password" value={this.state.formData.password} onChange={this.handlePasswordChange} required></input>
            </div>
            <div className="col-sm-6">
              <label><strong>Repeat Password</strong></label>
              <input className="form-control" type="password" value={this.state.formData.repeatpassword} onChange={this.handleRepeatPasswordChange} required></input>
            </div>
          </div>
          <div className="row signup-buttons">
            <div className="col-sm-1">
            </div>
            <div className="col-sm-4 text-center signup-button">
              <button type="submit" className="btn btn-success btn-block btn-lg"><strong>Sign Up</strong></button>
            </div>
            <div className="col-sm-2">
            </div>
            <div className="col-sm-4 text-center signup-button">
              <Link to={'/login/'} className="btn btn-primary btn-block btn-lg"><strong>Login</strong></Link>
            </div>
            <div className="col-sm-1">
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Signup;
