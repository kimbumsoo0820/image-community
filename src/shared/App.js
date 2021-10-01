import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import React from "react";
import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import Header from "../components/Header";
import { Grid } from "../elements";

function App() {
  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Signup}></Route>
        </ConnectedRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;
