import 'pages/Login.css';

import React, {Component} from 'react';

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
    handleLogin = event => {
        event.preventDefault();
        // login code
    }
    render() {
        return (
            <div>
                <form class="loginForm" onSubmit={this.handleSubmit}>
                    <input name="id" type="username" placeholder="ID" onChange={this.handleChange} />
                    <br/>
                    <input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                    <br/>
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }
}

export default Login;