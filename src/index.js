import React from "react";
import ReactDOM from "react-dom";
import "./style/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ReactGA from "react-ga";

const GOOGLE_TRACKING_ID = process.env.REACT_APP_GOOGLE_TRACKING_ID;
ReactGA.initialize(GOOGLE_TRACKING_ID);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
