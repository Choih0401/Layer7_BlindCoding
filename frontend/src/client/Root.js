import React from "react";
import { BrowserRouter, Route, Switch, HashRouter } from "react-router-dom";
import {
    Login,
    Rank,
    Problem,
    Home
} from "pages";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const Root = ({ store, persistor }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HashRouter>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/login/" component={Login} />
                            <Route exact path="/rank/" component={Rank} />
                            <Route exact path="/problem/" component={Problem} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </BrowserRouter>
                </HashRouter>
            </PersistGate>
        </Provider>
    )
};

Root.propTypes = {
    store: PropTypes.object.isRequired,
    persistor: PropTypes.object.isRequired
};

export default Root;