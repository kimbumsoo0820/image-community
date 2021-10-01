import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../redux/configureStore";

import React from "react";
import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PostWrite from "../pages/PostWrite";
import PostDetail from "../pages/PostDetail";

import Header from "../components/Header";
import { Button, Grid } from "../elements";

import { actionCreators as userActions } from "../redux/modules/user";
import { useDispatch } from "react-redux";

import { apiKey } from "./firebase";
import Permit from "./Permit";

function App() {
  const dispatch = useDispatch();

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  //컴포넌트 라이프사이클의 componentDidMount (처음) 랑 componentDidUpdate (우리가 원하는 변화를 모두 반영하고 난 뒤에 호출) 를 동시에 수행한다.
  React.useEffect(() => {
    //session 이 있으면 loginCheckFB 실행 시킴
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);
  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Signup}></Route>
          <Route path="/write" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button is_float text="+">
          +
        </Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;
