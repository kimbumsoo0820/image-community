import "./App.css";
import React from "react";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Singup from "../pages/Signup";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";
import Search from "./Search";
import Notification from "../pages/Notification";

import Header from "../components/Header";
import { Button, Grid } from "../elements";
import Permit from "./Permit";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { apiKey } from "./firebase";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        {/* ConnectedRouter를 사용해 history를 바로 넘겨준다. */}
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Singup}></Route>
          <Route path="/write" exact component={PostWrite}></Route>
          <Route path="/write/:id" exact component={PostWrite}></Route>
          <Route path="/post/:id" exact component={PostDetail}></Route>
          <Route path="/search" exact component={Search}></Route>
          <Route path="/noti" exact component={Notification}></Route>
        </ConnectedRouter>
      </Grid>
      {/* 로그인을 했을 때만 보인다. */}
      <Permit>
        <Button
          is_float
          text="+"
          _onClick={() => {
            history.push("/write");
          }}
        >
          +
        </Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;
