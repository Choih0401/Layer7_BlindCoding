import React, {Component} from 'react';
import { connect } from "react-redux";
import { URL } from "config";

import '../css/Home.css';
import yg_pic from "../img/team/1.jpg";
import king_pic from "../img/team/2.jpg";
import hw_pic from "../img/team/3.jpg";


class Home extends Component {
    state = {
        name: '',
        phoneNumber: '',
        email: '',
        id: '',
        password: '',
    }
    constructor(props) {
        super(props);
        if (props.store.login.status === 'SUCCESS')
            props.history.push('/list/');
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
        fetch(URL + "auth/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "name=" + this.state.name +
                "&phonenumber=" + this.state.phoneNumber +
                "&email=" + this.state.email +
                "&id=" + this.state.id +
                "&password=" + this.state.password
        })
        .then(response => response.json())
        .then(json => {
            alert(json.detail);
            if(json.code === 200) 
                this.props.history.push('/login');
        })
    }
    render() {
        return (
            <div>
                <header className="masthead">
                    <div className="container" style={{height: "100vh"}}>
                        <div className="intro-text">
                            <div className="intro-heading text-uppercase">Layer7 Blind Coding</div>
                            <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger" style={{width:"150px"}}href="#services">More info</a>
                            <br/>
                            <br/>
                            <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger" style={{width:"150px"}}href="#contactForm"> Register </a>
                            <br/>
                            <br/>
                            <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger" style={{width:"150px"}}onClick={() => {this.props.history.push('/login')}}>  Login  </a>
                        </div>
                    </div>
                </header>

                <section className="page-section" id="services">
                    <div className="container" style={{height: "70vh"}}>
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading text-uppercase">how to</h2>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-md-4">
                            <span className="fa-stack fa-4x">
                            </span>
                            <h4 className="service-heading"> </h4>
                            <p className="text-muted"> </p>
                            </div>
                            <div className="col-md-4   ">
                            <span className="fa-stack fa-4x">
                                <i className="fas fa-circle fa-stack-2x text-primary"></i>
                                <i className="fas fa-laptop fa-stack-1x fa-inverse"></i>
                            </span>
                            <p className="text-muted">Fill your forms at the registration page to get started.<br/>
                                After that, check the outputs that you're supposed to make by writing codes.<br/>
                                Then wear a blindfold, and select the programming language that you want to use. Now you're ready to go for the challenges.<br/>
                                You can continue to the next level if the output that you've made is correct. Cheer up!</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section" id="team">
                    <div className="container"style={{height: "65vh"}}>
                        <div className="row">
                            <div className="col-lg-12 text-center">
                            <h2 className="section-heading text-uppercase">Programmers</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                            <div className="team-member">
                                <img className="mx-auto rounded-circle" src={yg_pic} alt="Face of a handsome guy" />
                                <h4>Kim Yeongyu</h4>
                            </div>
                            </div>
                            <div className="col-sm-4">
                            <div className="team-member">
                                <img className="mx-auto rounded-circle" src={king_pic} alt="Face of a handsome guy" />
                                <h4>Kim Junseo</h4>
                            </div>
                            </div>
                            <div className="col-sm-4">
                            <div className="team-member">
                                <img className="mx-auto rounded-circle" src={hw_pic} alt="Face of a handsome guy" />
                                <h4>Choi Hyeonu</h4>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="page-section" id="contact">
                    <div className="container"style={{height: "80vh"}}>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                        <h2 className="section-heading text-uppercase">Start blind coding</h2>
                        <h3 className="section-subheading text-muted">  </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                        <form onSubmit={this.handleSubmit} id="contactForm" name="sentMessage" method="POST">
                            <div className="row">
                            <div className="clearfix"></div>
                            <div className="col-lg-12 text-center">
                                <div id="success"></div>
                                <div className="form-group">
                                <input className="form-control" onChange={this.handleChange} id="id" name="id" type="text" placeholder="ID *" required="required" data-validation-required-message="Please enter your ID." />
                                <p className="help-block text-danger"></p>
                                </div>
                                <div className="form-group">
                                <input className="form-control" onChange={this.handleChange} id="pw" name="password" type="password" placeholder="PASSWORD *" required="required" data-validation-required-message="Please enter your PASSWORD."   />
                                <p className="help-block text-danger"></p>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" onChange={this.handleChange} id="name" name="name"type="text" placeholder="Name *" required="required" data-validation-required-message="Please enter your name."  />
                                    <p className="help-block text-danger"></p>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" onChange={this.handleChange} id="email" name="email" type="email" placeholder="Email *" required="required" data-validation-required-message="Please enter your email address."  />
                                    <p className="help-block text-danger"></p>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" onChange={this.handleChange} id="phone" name="phoneNumber" type="tel" placeholder="Phone *" required="required" data-validation-required-message="Please enter your phone number."  />
                                    <p className="help-block text-danger"></p>
                                </div>
                                <button id="sendMessageButton" className="btn btn-primary btn-xl text-uppercase" type="submit">Start</button>
                            </div>
                            </div>
                        </form>
                        </div>
                    </div>
                    </div>
                </section>

                    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        store: state
    };
};
export default connect(
    mapStateToProps
)(Home);