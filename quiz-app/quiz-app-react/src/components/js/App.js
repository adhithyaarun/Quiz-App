import React, { Component } from 'react';
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import Logout from './Logout'
import ExploreGenres from './ExploreGenres'
import ExploreQuizzes from './ExploreQuizzes'
import CreateGenre from './CreateGenre'
import DeleteGenre from './DeleteGenre'
import CreateQuiz from './CreateQuiz'
import DeleteQuiz from './DeleteQuiz'
import AddQuestion from './AddQuestion'
import Users from './Users'
import ViewQuiz from './ViewQuiz'
import UpdateQuestion from './UpdateQuestion'
import LeaderboardAll from './LeaderboardAll'
import Performance from './Performance'
import Panel from './Panel'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      isAuthenticated: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
  }

  handleSearchChange (event) {
    this.setState({searchText: event.target.value});
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <Link to={'/'} className="navbar-brand">Quiz World</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                  {sessionStorage.getItem("authenticated") == "true" &&
                    <li className="nav-item">
                      <Link to={'/explore/'} className="nav-link text-light">Explore</Link>
                    </li>
                  }
                  {sessionStorage.getItem("authenticated") != "true" &&
                    <li className="nav-item">
                      <Link to={'/login/'} className="nav-link text-light">Login</Link>
                    </li>
                  }
                  {sessionStorage.getItem("authenticated") != "true" &&
                    <li className="nav-item">
                      <Link to={'/signup/'} className="nav-link text-light">Sign Up</Link>
                    </li>
                  }
                  {sessionStorage.getItem("authenticated") == "true" &&
                    <li className="nav-item">
                      <Link to={'/leaderboard/'} className="nav-link text-light">Leaderboard</Link>
                    </li>
                  }
                  {sessionStorage.getItem("authenticated") == "true" &&
                    <li className="nav-item">
                      <Link to={'/performance/'} className="nav-link text-light">Performance</Link>
                    </li>
                  }
                  {sessionStorage.getItem("admin") == "true" &&
                    <li className="nav-item">
                      <Link to={'/users/'} className="nav-link text-light">Users</Link>
                    </li>
                  }
                  {sessionStorage.getItem("admin") == "true" &&
                    <li className="nav-item">
                      <Link to={'/panel/'} className="nav-link text-light">Genre Control</Link>
                    </li>
                  }
                  {sessionStorage.getItem("authenticated") == "true" &&
                    <li className="nav-item">
                      <Link to={'/logout/'} className="nav-link text-light">Logout</Link>
                    </li>
                  }
                </ul>
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/index/" component={Home}></Route>
              <Route exact path="/signup/" component={Signup}></Route>
              <Route exact path="/login/" component={Login}></Route>
              <Route exact path="/logout/" component={Logout}></Route>
              <Route exact path="/explore/" component={ExploreGenres}></Route>
              <Route exact path="/explore/:genre" component={ExploreQuizzes}></Route>
              <Route exact path="/quiz/:quizid" component={ViewQuiz}></Route>
              <Route exact path="/leaderboard/" component={LeaderboardAll}></Route>
              <Route exact path="/performance/" component={Performance}></Route>

              <Route exact path="/create/genre" component={CreateGenre}></Route>
              <Route exact path="/delete/genre" component={DeleteGenre}></Route>
              <Route exact path="/create/quiz/:genre" component={CreateQuiz}></Route>
              <Route exact path="/delete/quiz/:genre" component={DeleteQuiz}></Route>
              <Route exact path="/create/question/:quizid" component={AddQuestion}></Route>
              <Route exact path="/users/" component={Users}></Route>
              <Route exact path="/update/question/:questionid" component={UpdateQuestion}></Route>
              <Route exact path="/panel/" component={Panel}></Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
