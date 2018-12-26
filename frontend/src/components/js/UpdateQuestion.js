import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class UpdateQuestion extends Component {
  constructor() {
    super();
    this.state = {
      questionData: {
        id: 0,
        quizid: 0,
        question: "",
        options: [],
        numcorrect: 0
      },
      optionData: [],
      error: "",
      message: "",
      refresher: 1,
      markedCorrect: 0,
    };
    this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
    this.handleOptionSubmit = this.handleOptionSubmit.bind(this);

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);

    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleCorrectChange = this.handleCorrectChange.bind(this);
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      fetch('http://localhost:8080/question/' + this.props.match.params.questionid, {
        method: 'GET'
      })
        .then(response => response.json())
          .then(question => {
            this.setState({questionData: question});
            this.setState({optionData: JSON.parse(JSON.stringify(question.options))});
            this.setState({markedCorrect: question.numcorrect});
          });
    }
    else
    {
      window.location = "/login/";
    }
  }

  handleQuestionSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/update/question/', {
        method: 'PUT',
        body: JSON.stringify(this.state.questionData),
    })
      .then(response => {
        if(response.status == 200)
        {
          this.setState({refresher: this.state.refresher+1});
        }
      });
  }

  handleOptionSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/update/option/', {
        method: 'PUT',
        body: JSON.stringify(this.state.optionData[Number(event.target.id)]),
    })
      .then(response => {
        if(response.status == 200)
        {
          this.setState({refresher: this.state.refresher+1});
        }
      });
  }

  handleQuestionChange (event) {
    var temp = Object.assign({}, this.state.questionData);
    temp.question = event.target.value;
    this.setState({questionData: temp});
  }

  handleNumberChange (event) {
    var temp = Object.assign({}, this.state.questionData);
    temp.numcorrect = Number(event.target.value);
    this.setState({questionData: temp});
  }

  handleContentChange (event) {
    var i = Number(event.target.id);
    var temp = JSON.parse(JSON.stringify(this.state.optionData));
    temp[i].content = event.target.value;
    this.setState({optionData: temp});
  }

  handleCorrectChange (event) {
    var i = Number(event.target.id);
    if(this.state.markedCorrect < this.state.questionData.numcorrect)
    {
      var temp = JSON.parse(JSON.stringify(this.state.optionData));
      temp[i].correct = !temp[i].correct;
      if(temp[i].correct == true)
      {
        this.setState({markedCorrect: this.state.markedCorrect+1});
      }
      else
      {
        this.setState({markedCorrect: this.state.markedCorrect-1});
      }
      this.setState({optionData: temp});
    }
    else if(this.state.markedCorrect == this.state.questionData.numcorrect)
    {
      var temp = JSON.parse(JSON.stringify(this.state.optionData));
      temp[i].correct = !temp[i].correct;
      if(temp[i].correct == false)
      {
        this.setState({markedCorrect: this.state.markedCorrect-1});
        this.setState({optionData: temp});
      }
    }
  }

  handleDeleteOption (event) {
    fetch('http://localhost:8080/delete/option/'+ String(this.state.optionData[Number(event.target.id)].id), {
      method: 'DELETE',
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
      <div className="container">
        <p className="display-3 text-center add-quiz-heading">Edit Question</p>
        <form onSubmit={this.handleQuestionSubmit}>
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
          {this.state.message &&
            <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8">
                <div className="text-center alert alert-info">
                    <span>
                      {this.state.message}
                    </span>
                </div>
              </div>
              <div className="col-sm-2"></div>
            </div>
          }
          <div className="form-group row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <textarea className="form-control" value={this.state.questionData.question} onChange={this.handleQuestionChange} placeholder="Problem Statement" required/>
            </div>
            <div className="col-sm-2"></div>
          </div>
          <div className="form-group row">
            <div className="col-sm-2"></div>
            <div className="col-sm-3">
              Number of correct answers:
            </div>
            <div className="col-sm-2">
              <select className="form-control" value={this.state.questionData.numcorrect} onChange={this.handleNumberChange} required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="col-sm-1"></div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary btn-block">Save</button>
            </div>
            <div className="col-sm-2"></div>
          </div>
        </form>
        <br></br>
        {this.state.optionData.length > 0 &&
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
                {this.state.optionData.length > 0 && this.state.optionData.map(function(item, key){
                  return(
                    <form id={key} className="form" key={item.id} onSubmit={this.handleOptionSubmit}>
                      <table className="table">
                        <tr>
                          <td><textarea id={key} type="text" className="form-control" value={this.state.optionData[key].content} onChange={this.handleContentChange} required/></td>
                          <td>Correct? <input id={key} type="checkbox" checked={this.state.optionData[key].correct} onChange={this.handleCorrectChange}/></td>
                          <td><button type="submit" id={key} className="btn btn-primary">Save</button></td>
                          <td><button type="button" id={key} className="btn btn-danger" onClick={this.handleDeleteOption}>Delete</button></td>
                        </tr>
                      </table>
                    </form>
                  )
                }, this)}
            </div>
            <div className="col-sm-2"></div>
            <br></br>
            <br></br>
          </div>
        }
      </div>
    );
  }
}

export default UpdateQuestion;
