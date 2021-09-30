import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import PostList from "../pages/PostList";
import Login from "../pages/Login";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Route path="/" exact component={PostList}></Route>
        <Route path="/login" exact component={Login}></Route>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
