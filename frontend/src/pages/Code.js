import React, {Component} from 'react';

class Code extends Component {
    state = {
        language: "cpp",
        content: "",
        isCompiled: false,
        results: "",
    }
    handleChange = event => {
        const {name, value} = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    handleCompileButton = event => {
        event.preventDefault();
        fetch(URL + "auth/signin/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "language=" + this.state.language +
                "&content=" + this.state.content
        })
        .then(response => response.json())
        .then(json => {
            this.setState({
                ...this.state,
                isCompiled: true,
                results: json.detail
            });
        });
    }
    handleResultButton = event => {
        event.preventDefault();
        // move to results page
    }
    render() {
        return (
            <div>
                <select value={this.state.language} name="language">
                    <option value="cpp">cpp</option>
                    <option value="c">c</option>
                    <option value="python2">python2</option>
                    <option value="python3">python3</option>
                </select>
                <textarea value={this.state.content} name="content" onChange={this.handleChange}>

                </textarea>
                <button onClick> </button>
                {!this.state.isCompiled} ?
                    <button onClick={this.handleCompileButton}>Compile!</button>
                        :
                    <button onClick={this.handleResultbutton}>See the results</button>
            </div>
        )
    }
}

export default Code;