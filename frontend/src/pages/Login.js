import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, loginFailure, loginSuccess} from 'modules/account';
import { URL } from "config";


class Login extends Component {
    state = {
        id: '',
        password: ''
    }
    handleChange = event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    handleSubmit = event => {
        event.preventDefault();
        fetch(URL + "auth/signin/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "id=" + this.state.id +
                "&password=" + this.state.password
        })
        .then(response => response.json())
        .then(json => {
            if(json.code === 500)
                alert(json.detail.message);
            else {
                this.props.loginSuccess({id: this.state.id});
                this.props.history.push('/problem/');
                alert(json.detail);
            }
        });
    }
    render() {
        return (
            <div style={{"textAlign": 'center'}}>
                <h1 style={{"marginTop":"50px"}}>Login</h1>
                <form style={{"marginTop":"50px", "display": "flex", "flexDirection": "column", "alignItems": "center"}} className="loginForm" onSubmit={this.handleSubmit}>
                    <input style={{width: "50%"}} className="form-control" onChange={this.handleChange} id="id" name="id" type="text" placeholder="ID *" required="required" data-validation-required-message="Please enter your ID." />
                    <input style={{width: "50%"}}  className="form-control" onChange={this.handleChange} id="pw" name="password" type="password" placeholder="PASSWORD *" required="required" data-validation-required-message="Please enter your PASSWORD."   />
                    <button style={{"marginTop":"50px"}} id="sendMessageButton" className="btn btn-primary btn-xl text-uppercase" type="submit">Login</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { store: state };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => {
        return dispatch(login());
      },
      loginSuccess: data => {
        return dispatch(loginSuccess(data));
      },
      loginFailure: () => {
        return dispatch(loginFailure());
      }
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login);