import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "modules/account";
import { URL } from "config";

import '../css/Problem.css';

class Problem extends Component {
  state = {
    solvedCnt: 0,
    language: "c",
    content: "",
    isCompiled: false,
    results: "",
    isStarted: false,
    isPopup: false,
    isDone: false
  };

  problems = [
    { name: "name1", difficulty: "1", description: "description" },
    { name: "name2", difficulty: "1", description: "description" },
    { name: "name3", difficulty: "1", description: "description" },
    { name: "name4", difficulty: "1", description: "description" },
    { name: "name5", difficulty: "1", description: "description" }
  ];

  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  componentWillMount() {
    fetch(URL + "challenge/leaderboard", {
      method: "GET"
    })
      .then(response => response.json())
      .then(json => {
        var i;
        for (i in json.detail) {
          if (json.detail[i].name === this.props.store.status.id) {
            this.setState({
              ...this.state,
              solvedCnt: json.detail[i].question
            });
          }
        }
      }); // set current solvedCnt
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  };

  handleLanguage = event => {
    const { value } = event.target;
    this.setState({
      ...this.state,
      language: value
    });
  };

  handleCompileButton = event => {
    event.preventDefault();
    if (this.state.isCompiled) {
      this.setState({
        ...this.state,
        isPopup: true
      });
    } else {
      fetch(URL + "/challenge/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
          "language=" + this.state.language + "&content=" + this.state.content
      })
        .then(response => response.json())
        .then(json => {
          if (json.code === 500) {
            this.setState({
              ...this.state,
              isCompiled: true,
              results: "COMPILE ERROR"
            });
            return;
          }
          this.setState({
            ...this.state,
            isCompiled: true,
            results: json.detail.output
          });
        });
    }
  };

  onContinue = event => {
    event.preventDefault();
    fetch(URL + "/challenge/updatescore", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "id=" + this.props.store.status.id
    })
      .then(response => response.json())
      .then(json => {
        if (json.code === 500) {
          this.setState({
            ...this.state,
            isCompiled: true,
            results: "COMPILE ERROR"
          });
          return;
        }
        if(this.state.solvedCnt+1 === this.problems.length) {
          this.setState({
            ...this.state,
            isDone: true
          });

          fetch(URL + "/challenge/compare", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "id=" + this.props.store.status.id
          })
            .then(response => response.json())
            .then(json => {
                alert("You'll be logged out since you completed whole the challenge.");
                this.props.logout();
                this.props.history.push("/");
            });
          return;
        }
        this.setState({
          ...this.state,
          solvedCnt: this.state.solvedCnt + 1,
          language: "c",
          content: "",
          isCompiled: false,
          results: "",
          isStarted: false,
          isPopup: false
        });
      });
  };

  onFailed = event => {
    event.preventDefault();
    fetch(URL + "/challenge/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "id=" + this.props.store.status.id
    })
      .then(response => response.json())
      .then(json => {
          this.props.logout();
          this.props.history.push("/");
      });
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {this.state.isDone ? (
          <div style={{ backgroundColor: "black", color: "#fff" }}>
            <h1>You completed all the questions!</h1>
          </div>
        ) : null}
        {this.state.isPopup ? (
          <div style={{ backgroundColor: "black", color: "#fff" }}>
            <h1>Results</h1>
            <h2>{this.state.results}</h2>
            <button
              onClick={this.onFailed}
              style={{ margin: "5px" }}
              className="btn btn-primary btn-xl text-uppercase"
            >
              Failed
            </button>
            <button
              onClick={this.onContinue}
              style={{ margin: "5px" }}
              className="btn btn-primary btn-xl text-uppercase"
            >
              Continue
            </button>
          </div>
        ) : null}

        <h2 style={{ marginTop: "100px" }}>
          {this.state.solvedCnt + 1} -{" "}
          {this.problems[this.state.solvedCnt].name}
        </h2>
        <div style={{ marginTop: "20px" }}>Difficulty</div>
        <div style={{ marginTop: "20px" }}>
          {this.problems[this.state.solvedCnt].description}
        </div>
        <div style={{ textAlign: "center", width: "100%" }}>
          <div
            data-toggle="buttons"
            style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
          >
            <button
              onClick={this.handleLanguage}
              value="c"
              className="btn btn-success"
              style={{ margin: "5px" }}
            >
              C
            </button>
            <button
              onClick={this.handleLanguage}
              value="cpp"
              className="btn btn-success"
              style={{ margin: "5px" }}
            >
              CPP
            </button>
            <button
              onClick={this.handleLanguage}
              value="python2"
              className="btn btn-success"
              style={{ margin: "5px" }}
            >
              python2
            </button>
            <button
              onClick={this.handleLanguage}
              value="python3"
              className="btn btn-success"
              style={{ margin: "5px" }}
            >
              python3
            </button>
          </div>
          <div style={{ fontSize: "30px" }}>{this.state.language}</div>

          <br />
          <textarea
            unselectable="on"
            value={this.state.content}
            name="content"
            onChange={this.handleChange}
            style={{
              color: "#fff",
              resize: "none",
              width: "100%",
              height: "40vh"
            }}
            className="noselect form-control rounded-0"
            id="code"
          ></textarea>
          <br />

          <button
            className="btn btn btn-danger"
            onClick={this.handleCompileButton}
          >
            {!this.state.isCompiled ? "Compile!" : "Get Results"}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { store: state };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      return dispatch(logout());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Problem);
