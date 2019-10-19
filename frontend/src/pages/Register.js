import 'pages/Register.css';

import React, {Component} from 'react';

class Register extends Component {
    state = {
        name: '',
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
    handleRegister = event => {
        event.preventDefault();
        // login code
    }
    render() {
        return (
            <div>
                <form class="RegisterForm" onSubmit={this.handleSubmit}>
                    <input name="name" type="username" placeholder="Name" value={this.handleChange} />
                    <br/>
                    <input name="id" type="username" placeholder="ID" onChange={this.handleChange} />
                    <br/>
                    <input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
                    <br/>
                    <button type="submit">Register</button>
                </form>
            </div>
        )
    }
}

export default Register;