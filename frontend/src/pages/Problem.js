import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "modules/account";
import { URL } from "config";

import "../css/Problem.css";

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
    {
      name: "Print Hello, Layer7",
      difficulty: "1",
      description: "Print Hello, Layer7<br/><br/>Output: Hello, Layer7"
    },
    {
      name: "Print numbers from 1 to 10",
      difficulty: "2",
      description:
        "Print numbers from 1 to 10<br/><br/>Output: 1 2 3 4 5 6 7 8 9 10"
    },
    {
      name: "Print stairs with stars",
      difficulty: "3",
      description:
        "Print stairs with stars<br/><br/>Output: <br/>*<br/>**<br/>***<br/>****<br/>*****"
    },
    {
      name: "Print numbers of multiple of 3 between 1 to 100000",
      difficulty: "4",
      description:
        "Print numbers of multiple of 3 between 1 to 100000<br/><br/>Output: Hidden"
    },
    {
      name: "Print result of 12345432 / i when i increases from 0 to 5",
      difficulty: "5",
      description:
        "Print result of 12345432 / i when i increases from 0 to 5<br/><br/>Output: Hidden"
    },
    {
      name: "Print a diamond with stars",
      difficulty: "6",
      description:
        "Print a diamond with stars<br/><br/>Output:<br/>&nbsp;&nbsp;*<br/>&nbsp;***<br/>*****<br/>&nbsp;***<br/>&nbsp;&nbsp;*"
    },
    {
      name: 'Print "L4y3r7" + "1n" + "SunR1n 1nt3rnet H1gh Sch00l"',
      difficulty: "7",
      description:
        'Print "L4y3r7" + "1n" + "SunR1n 1nt3rnet H1gh Sch00l"<br/><br/>Output: "L4y3r7" + "1n" + "SunR1n 1nt3rnet H1gh Sch00l"'
    }
  ];

  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  componentDidMount() {
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

  onFailed = event => {
    event.preventDefault();
    fetch(URL + "challenge/compare", {
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

  selectText = () => {
    this.refs.newText.getDOMNode().select();
  };

  onKeyDown = event => {
    if (event.keyCode === 9) {
      event.preventDefault();
      let v = this.state.content,
        s = event.target.selectionStart,
        e = event.target.selectionEnd;
      this.setState(
        {
          ...this.state,
          content: v.substring(0, s) + "\t" + v.substring(e)
        },
        () => {
          this.refs.input.selectionStart = this.refs.input.selectionEnd = s + 1;
        }
      );
      this.selectionStart = this.selectionEnd = s + 1;
      return false;
    }
  };

  handleCompileButton = event => {
    event.preventDefault();
    if (this.state.isCompiled) {
      window.scrollTo(0, 0);
      this.setState({
        ...this.state,
        isPopup: true
      });
    } else {
      fetch(URL + "challenge/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
          "language=" +
          this.state.language +
          "&content=" +
          encodeURI(this.state.content)
            .replace(/\+/gi, "%2b")
            .replace(/\&/gi, "%26")
      })
        .then(response => response.json())
        .then(json => {
          if (json.code === 500) {
            this.setState({
              ...this.state,
              isCompiled: true,
              results: "COMPILE ERROR"
            });
          } else {
            this.setState({
              ...this.state,
              isCompiled: true,
              results: json.detail.output
                .replace(/\n/gi, "<br>")
                .replace(" ", "&nbsp;")
            });
          }
        });
    }
  };

  onContinue = event => {
    event.preventDefault();
    fetch(URL + "challenge/updatescore", {
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
            results: "CALL THE STAFF"
          });
          return;
        }
        if (this.state.solvedCnt + 1 === this.problems.length) {
          this.setState({
            ...this.state,
            isDone: true
          });

          fetch(URL + "challenge/compare", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "id=" + this.props.store.status.id
          })
            .then(response => response.json())
            .then(json => {
              alert(
                "You'll be logged out since you completed whole the challenge."
              );
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

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {this.state.isDone ? (
          <div style={{ backgroundColor: "black", color: "#fff" }}>
            <h1>You've completed all the questions!</h1>
          </div>
        ) : null}
        {this.state.isPopup ? (
          <div
            style={{
              backgroundColor: "black",
              color: "#fff",
              textAlign: "left"
            }}
          >
            <div
              style={{
                marginLeft: "30vw"
              }}
            >
              <h1>Results</h1>
              <div
                dangerouslySetInnerHTML={{ __html: this.state.results }}
              ></div>
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
          </div>
        ) : null}

        <h2 style={{ marginTop: "100px" }}>
          {this.state.solvedCnt + 1} -{" "}
          {this.problems[this.state.solvedCnt].name}
        </h2>
        <div style={{ marginTop: "20px" }}>
          {this.problems[this.state.solvedCnt].difficulty}
        </div>
        <div
          style={{ marginTop: "20px", textAlign: "left", marginLeft: "30vw" }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: this.problems[this.state.solvedCnt].description
            }}
          ></div>
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
            spellCheck="false"
            unselectable="on"
            ref="input"
            value={this.state.content}
            name="content"
            onChange={this.handleChange}
            style={{
              color: "white",
              resize: "none",
              width: "100%",
              height: "40vh"
            }}
            className="noselect form-control rounded-0"
            id="code"
            onKeyDown={this.onKeyDown}
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
