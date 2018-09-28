import React, { Component } from 'react';
import Signup from './Signup'
import '../css/Login.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: "",
      },
      error: ""
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
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
    fetch('http://localhost:8080/login/', {
      method: 'POST',
      body: JSON.stringify(this.state.formData),
    })
      .then(response => {
        if(response.status == 200)
        {
          response.json().then(res => {
            this.setState({
              formData:{
                username: "",
                password: ""
              },
              error: ""
            });
            sessionStorage.setItem("authenticated", "true");
            sessionStorage.setItem("id", String(res.id));
            sessionStorage.setItem("username", String(res.username));
            sessionStorage.setItem("admin", String(res.admin));
            window.location = "/";
          });
        }
        else if(response.status == 401)
        {
          this.setState({
            formData:{
              username: this.state.formData.username,
              password: ""
            },
            error: "Incorrect password"
          });
        }
        else if(response.status == 404)
        {
          this.setState({
            formData:{
              username: "",
              password: ""
            },
            error: "Incorrect username"
          });
        }
        else
        {
          this.setState({
            formData:{
              username: "",
              password: ""
            },
            error: ""
          });
        }
      });
  }

  handleUsernameChange (event) {
    this.setState({
      formData: {
        username: event.target.value,
        password: this.state.formData.password,
      }
    });
  }

  handlePasswordChange (event) {
    this.setState({
      formData: {
        username: this.state.formData.username,
        password: event.target.value,
      }
    });
  }

  render() {
    return (
      <div className="container">
        <p className="display-3 text-center login-heading">Login</p>
        <form onSubmit={this.handleSubmit}>
          {this.state.error &&
            <div className="row">
              <div className="col-sm-4"></div>
              <div className="col-sm-4">
                <div className="alert alert-danger">
                    <span>
                      {this.state.error}
                    </span>
                </div>
              </div>
              <div className="col-sm-4"></div>
            </div>
          }
          <div className="form-group row">
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <label><strong>Username</strong></label>
              <input className="form-control" type="text" value={this.state.formData.username} onChange={this.handleUsernameChange} required></input>
            </div>
            <div className="col-sm-4"></div>
          </div>
          <div className="form-group row">
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <label><strong>Password</strong></label>
              <input className="form-control" type="password" value={this.state.formData.password} onChange={this.handlePasswordChange} required></input>
            </div>
            <div className="col-sm-4"></div>
          </div>
          <div className="row login-buttons">
            <div className="col-sm-4"></div>
            <div className="col-sm-2 text-center login-button">
              <button type="submit" className="btn btn-primary btn-block"><strong>Login</strong></button>
            </div>
            <div className="col-sm-2 text-center login-button">
              <Link to={'/signup/'} className="btn btn-success btn-block"><strong>Sign Up</strong></Link>
            </div>
            <div className="col-sm-4"></div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
