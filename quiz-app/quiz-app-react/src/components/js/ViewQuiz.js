import React, { Component } from 'react';
import '../css/Component.css'
import '../css/ViewQuiz.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class ViewQuiz extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      optionData: {},
      requestData: {
        userid: Number(sessionStorage.getItem("id")),
        quizid: 0,
        value: 0
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.checkme = this.checkme.bind(this);
    this.makerequest = this.makerequest.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true")
    {
      fetch('http://localhost:8080/quiz/' + this.props.match.params.quizid, {
        method: 'GET'
      })
        .then(response => response.json())
          .then(questions => {
            this.setState({questions: questions})
            if(questions.length > 0)
            {
              this.setState({
                requestData: {
                  userid: this.state.requestData.userid,
                  quizid: this.state.questions[0].quizid,
                  value: 0
                }
              });
              for(var i = 0; i < this.state.questions.length; i++)
              {
                let temp = Object.assign({}, this.state.optionData);
                temp[String(i)] = [];
                this.setState({optionData: temp});
              }
            }
          });
    }
    else
    {
      window.location = "/login/";
    }
  }

  makerequest() {
    fetch('http://localhost:8080/submit/', {
      method: 'POST',
      body: JSON.stringify(this.state.requestData)
    })
    .then(response => response.json())
    .then(score => {
      window.location = "/explore/";
    });
  }

  handleSubmit (event) {
    event.preventDefault();
    var flag = false;
    for(var i = 0; i < this.state.questions.length; i++)
    {
      if(this.state.optionData[String(i)].length != this.state.questions[i].numcorrect)
      {
        continue;
      }
      else
      {
        for(var j = 0; j < this.state.optionData[String(i)].length; j++)
        {
          if(this.state.questions[i].options[this.state.optionData[String(i)][j]].correct)
          {
            flag = true;
          }
        }
        if(flag)
        {
          this.state.requestData.value += 10;
        }
      }
    }
    this.makerequest();
  }

  handleCheckChange (event) {
    var values = event.target.id.split(" ");
    var temp = Object.assign({}, this.state.optionData);
    if(this.state.optionData[String(values[0])].includes(Number(values[1])))
    {
      temp[values[0]].splice((temp[values[0]].lastIndexOf(Number(values[1]))), 1);
      this.setState({optionData: temp});
    }
    else
    {
      temp[values[0]].push(Number(values[1]));
      this.setState({optionData: temp});
    }
  }

  checkme(key, index) {
    // console.log(this.state.optionData[String(key)]);
    if(this.state.optionData[String(key)])
    {
      if(this.state.optionData[String(key)].includes(Number(index)))
      {
        return true;
      }
    }
    else
    {
      return false;
    }
  }

  handleRemove(event) {
    fetch('http://localhost:8080/delete/question/' + event.target.value, {
      method: 'DELETE'
    })
      .then(response => {
        if(response.status == 200)
        {
          window.location.reload();
        }
      });
  }

  render() {
    return (
      <div className="container component-container">
        <div className="questions-area">
          <form className="form" onSubmit={this.handleSubmit}>
            {this.state.questions.length > 0 && this.state.questions.map(function(question, key) {
              return(
                  <div className="card question-card" key={key} id={"question" + key}>
                    <div className="card-header text-center text-white bg-dark">
                      Question {key+1}
                    </div>
                    <div className="card-body">
                      <p className="card-title h5 question-text">{question.question}</p>
                        {question.options.map(function(options, index){
                          return(
                            <p className="card-text">
                              <input type="checkbox" id={String(key) + " " + String(index)} checked={this.checkme(key, index)} onChange={this.handleCheckChange}></input> {options.content}
                            </p>
                          )
                        }, this, key)}
                    </div>
                    {sessionStorage.getItem("admin") == "true" &&
                      <div className="card-footer bg-dark">
                        <Link to={'/update/question/' + String(question.id)} className="btn btn-primary float-left">Edit</Link>
                        <button type="button" value={question.id} className="btn btn-danger float-right" onClick={this.handleRemove}>Remove</button>
                      </div>
                    }
                  </div>
              )
            }, this)}
            {this.state.questions.length > 0 &&
              <div className="row">
                <div className="col-sm-4">
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-success btn-block btn-lg" type="submit">Submit</button>
                </div>
                <div className="col-sm-4">
                </div>
              </div>
            }
            {this.state.questions.length == 0 &&
              <div className="text-center display-4">
                <br/>
                <p>Warm up your brain!<br/>Questions coming your way!</p>
              </div>
            }
          </form>
        </div>
        <div>
          <footer className="fixed-bottom bg-dark">
            {this.state.questions.length > 0 &&
              <div className="navigator pagination justify-content-center text-white">
                <div class="btn-group mr-2" role="group" aria-label="First group">
                  {this.state.questions.map(function(item, key){
                    return(
                      <a class="btn btn-secondary" href={"#question" + String(key)}>{"Q" + (key+1)}</a>
                    )
                  })}
                </div>
              </div>
            }
            {sessionStorage.getItem("admin") == "true" &&
              <div className="row add-question-button">
                <div className="col-sm-4"></div>
                {this.state.questions.length == 0 &&
                  <div className="col-sm-4">
                    <Link to={'/create/question/' + this.props.match.params.quizid} className="btn btn-success btn-block btn-lg">Add Question</Link>
                  </div>
                }
                {this.state.questions.length > 0 &&
                  <div className="col-sm-4">
                    <Link to={'/create/question/' + this.props.match.params.quizid} className="btn btn-success btn-block btn-lg">Add Question</Link>
                  </div>
                }
                <div className="col-sm-4"></div>
              </div>
            }
          </footer>
        </div>
      </div>
    );
  }
}

export default ViewQuiz;
