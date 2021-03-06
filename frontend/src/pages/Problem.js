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
      name: "Print Layer7 in Power of community",
      difficulty: "1",
      description: "<br/>Output: Layer7 in Power of community"
    },
    {
      name: "Print BlindCodingIssOFun",
      difficulty: "2",
      description: "<br/>Output: BlindCodingIssOFun"
    },
    {
      name: "Print 17+8-10x(2+3)",
      difficulty: "3",
      description:
        "Print expression 17+8-10x(2+3)<br/><br/>Output: 17+8-10x(2+3)"
    },
    {
      name: "Print multiple of 7 between 1 to 100",
      difficulty: "4",
      description: "<br/>Output: Hidden"
    },
    {
      name:
        "Print This is a very very very very very very very long sentence in reversed index",
      difficulty: "5",
      description: "<br/>Output: Hidden"
    },
    {
      name: "Print 5x5 sized snail array",
      difficulty: "6",
      description: "<br/>Output: Hidden"
    },
    {
      name: "Print two diamonds with stars horizontally",
      difficulty: "7",
      description:
        "Output: <br/>&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br/>&nbsp;***&nbsp;&nbsp;&nbsp;&nbsp;***<br/>*****&nbsp;*****<br/>&nbsp;***&nbsp;&nbsp;&nbsp;&nbsp;***<br/>&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br/>"
    },
    {
      name: "Print 5x5 sized diagonal array",
      difficulty: "8",
      description: "Output: Hidden"
    },
    {
      name: "Print Layer7 in hex",
      difficulty: "8",
      description: "Output: Hidden"
    },
    {
      name: "Print 1011010110010010 in decimal",
      difficulty: "9",
      description: "Output: Hidden"
    },
    {
      name: `Print " " ' ' " ' " " ' " ' ' ' " " " ' " ' ' "`,
      difficulty: "10",
      description: `Output: " " ' ' " ' " " ' " ' ' ' " " " ' " ' ' "`
    },
    {
      name: `Print a star of David`,
      difficulty: "10",
      description: `Output: <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*****<br/>***************<br/>&nbsp;*************<br/>&nbsp;&nbsp;***********<br/>&nbsp;*************<br/>***************<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*****<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;***<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br/>`
    }
  ];

  constructor(props) {
    super(props);
    if (props.store.login.status !== "SUCCESS") props.history.push("/");
  }

  componentDidMount() {
    if (this.props.match.params.num !== undefined)
      this.setState({
        ...this.state,
        solvedCnt: this.props.match.params.num * 1
      });
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
                .replace(/ /gi, "&nbsp;")
            });
            console.log(json.results);
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
          content: "",
          isCompiled: false,
          results: "",
          isStarted: false,
          isPopup: false
        });
        this.props.history.push("/problem/" + this.state.solvedCnt);
      });
  };

  onPenalty = () => {
    if (window.confirm("100 seconds will be added to your record.\nProceed?")) {
      fetch(URL + "/auth/penalty", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + this.props.store.status.id
      }).then(() => {
        this.setState({
          ...this.state,
          content: "",
          isCompiled: false,
          results: "",
          isStarted: false,
          isPopup: false
        });
      });
    }
  };

  onInit = () => {
    if (window.confirm("Remove your all records and start over.\nProceed?")) {
      fetch(URL + "/auth/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + this.props.store.status.id
      }).then(() => {
        this.setState({
          ...this.state,
          solvedCnt: 0,
          content: "",
          isCompiled: false,
          results: "",
          isStarted: false,
          isPopup: false
        });
      });
      this.props.history.push("/problem/" + this.state.solvedCnt);
    }
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
                onClick={this.onInit}
                style={{ margin: "5px" }}
                className="btn btn-primary btn-xl text-uppercase"
              >
                Start Over
              </button>
              <button
                onClick={this.onPenalty}
                style={{ margin: "5px" }}
                className="btn btn-primary btn-xl text-uppercase"
              >
                Retry
              </button>
              <button
                onClick={this.onFailed}
                style={{ margin: "5px" }}
                className="btn btn-primary btn-xl text-uppercase"
              >
                End
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
          {this.state.solvedCnt} - {this.problems[this.state.solvedCnt].name}
        </h2>
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
