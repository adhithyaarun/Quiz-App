import React, { Component } from 'react';
import '../css/AddQuestion.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class AddQuestion extends Component {
  constructor() {
    super();
    this.state = {
      questionFormData: {
        quizid: null,
        question: "",
        numcorrect: 1
      },
      optionFormData: {
        content: "",
        questionid: null,
        correct: false
      },
      error: "",
      message: "",
      addOptions: false,
      numCorrect: 1,
      markedCorrect: 0,
      addedOptions: []
    };
    this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
    this.handleOptionSubmit = this.handleOptionSubmit.bind(this);

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);

    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleCorrectChange = this.handleCorrectChange.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem("authenticated") == "true" && sessionStorage.getItem("admin") == "true")
    {
      this.setState({
        questionFormData: {
          quizid: Number(this.props.match.params.quizid),
          question: "",
          numcorrect: 1
        }
      });
    }
    else
    {
      window.location = "/login/";
    }
  }

  handleQuestionSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/create/question/' + this.props.match.params.quizid, {
        method: 'POST',
        body: JSON.stringify(this.state.questionFormData),
    })
      .then(response => response.json())
        .then(question => {
          this.setState({
            optionFormData: {
              content: "",
              questionid: question.id,
              correct: false
            }
          });
          this.setState({
            addOptions: true
          });
          this.setState({
            numCorrect: question.numcorrect
          });
          this.setState({
            message: "Question Added! You can now add the options."
          });
        });
  }

  handleOptionSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/create/option/', {
        method: 'POST',
        body: JSON.stringify(this.state.optionFormData),
    })
      .then(response => response.json())
        .then(option => {
          this.setState({
            addedOptions: this.state.addedOptions.concat(option)
          });
          this.setState({
            optionFormData: {
              content: "",
              questionid: this.state.optionFormData.questionid,
              correct: false
            }
          });
          if(option.correct)
          {
            this.setState({
              markedCorrect: this.state.markedCorrect + 1
            });
          }
          this.setState({
            message: "Option Added!"
          });
        });
  }

  handleQuestionChange (event) {
    this.setState({
      questionFormData: {
        quizid: this.state.questionFormData.quizid,
        question: event.target.value,
        numcorrect: this.state.questionFormData.numcorrect
      }
    });
  }

  handleNumberChange (event) {
    this.setState({
      questionFormData: {
        quizid: this.state.questionFormData.quizid,
        question: this.state.questionFormData.question,
        numcorrect: Number(event.target.value)
      }
    });
  }

  handleContentChange (event) {
    this.setState({
      optionFormData: {
        content: event.target.value,
        questionid: this.state.optionFormData.questionid,
        correct: this.state.optionFormData.correct
      }
    });
  }

  handleCorrectChange (event) {
    this.setState({
      optionFormData: {
        content: this.state.optionFormData.content,
        questionid: this.state.optionFormData.questionid,
        correct: !this.state.optionFormData.correct
      }
    });
  }

  handleNextQuestion (event) {
    window.location = window.location;
  }

  render() {
    return (
      <div className="container">
        <p className="display-3 text-center add-quiz-heading">New Question</p>
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
              <textarea className="form-control" value={this.state.questionFormData.question} onChange={this.handleQuestionChange} placeholder="Problem Statement" required/>
            </div>
            <div className="col-sm-2"></div>
          </div>
          <div className="form-group row">
            <div className="col-sm-2"></div>
            <div className="col-sm-3">
              Number of correct answers:
            </div>
            <div className="col-sm-2">
              <select className="form-control" value={this.state.questionFormData.numcorrect} onChange={this.handleNumberChange} required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="col-sm-1"></div>
            <div className="col-sm-2">
              {!this.state.addOptions &&
                <button type="submit" className="btn btn-success btn-block">Add Question</button>
              }
              {this.state.addOptions &&
                <button type="submit" className="btn btn-success btn-block" disabled>Add Question</button>
              }
            </div>
            <div className="col-sm-2"></div>
          </div>
        </form>
        <br></br>
        {this.state.addOptions &&
          <form onSubmit={this.handleOptionSubmit}>
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
            {this.state.addedOptions.length > 0 &&
              <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                  <table className="table">
                    <tr>
                      <th>Content</th>
                      <th>Correct?</th>
                    </tr>
                    {this.state.addedOptions.length > 0 && this.state.addedOptions.map(function(item){
                      return(
                        <tr key={item.id}>
                          <td>{item.content}</td>
                          <td>{String(item.correct)}</td>
                        </tr>
                      )
                    })}
                  </table>
                </div>
                <div className="col-sm-2"></div>
              </div>
            }
            <div className="form-group row">
              <div className="col-sm-2"></div>
              <div className="col-sm-4">
                <textarea type="text" className="form-control" value={this.state.optionFormData.content} onChange={this.handleContentChange} placeholder="Option content" required/>
              </div>
              {this.state.markedCorrect < this.state.numCorrect &&
                <div className="col-sm-1 text-right option-correct-text">
                  Correct Option?
                </div>
              }
              {this.state.markedCorrect >= this.state.numCorrect &&
                <div className="col-sm-1 text-right option-correct"></div>
              }
              {this.state.markedCorrect < this.state.numCorrect &&
                <div className="col-sm-1 option-correct">
                  <input type="checkbox" checked={this.state.optionFormData.correct} onChange={this.handleCorrectChange}/>
                </div>
              }
              {this.state.markedCorrect >= this.state.numCorrect &&
                <div className="col-sm-1 text-right option-correct-text"></div>
              }
              <div className="col-sm-2 option-submit">
                <button type="submit" className="btn btn-success btn-block">Add Option</button>
              </div>
              <div className="col-sm-2"></div>
            </div>
          </form>
        }
        <div className="row">
          {this.state.markedCorrect >= this.state.numCorrect &&
            <div className="col-sm-4"></div>
          }
          {this.state.markedCorrect >= this.state.numCorrect &&
            <div className="col-sm-4">
              <button className="btn btn-success btn-block" onClick={this.handleNextQuestion}>New Question</button>
            </div>
          }
          {this.state.markedCorrect >= this.state.numCorrect &&
            <div className="col-sm-4"></div>
          }
        </div>
      </div>
    );
  }
}

export default AddQuestion;
