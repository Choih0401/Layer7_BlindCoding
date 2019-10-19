import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
    Login,
    Register
} from "pages";
import PropTypes from "prop-types";

const Root = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login/" component={Login} />
                <Route exact path="/register/" component={Register} />
            </Switch>
        </BrowserRouter>
    );
};

Root.propTypes = {
    store: PropTypes.object.isRequired,
    persistor: PropTypes.object.isRequired
};

export default Root;