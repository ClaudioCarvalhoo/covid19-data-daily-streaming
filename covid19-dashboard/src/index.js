import "assets/css/material-dashboard-react.css?v=1.9.0";
import { createBrowserHistory } from "history";

import Admin from "layouts/Admin.js";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/index";

const hist = createBrowserHistory();
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Redirect from="/" to="/admin" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
