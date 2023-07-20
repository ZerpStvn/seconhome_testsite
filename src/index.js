import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/app/redux/store.js";
import App from "../src/app/App.jsx";

hydrate(
  <Provider store={store}>
    <Router basename="dashboard/">
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
