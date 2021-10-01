// 리덕스
// 1.import
// 첫째,createAction와 handleActions는 Action과 리듀서를 편하게 만들어준다.
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
import {
  getAuth,
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import firebase from "firebase/app";

// 2. actions(액션타입)
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// 3. action creator(액션 생성 함수들)
// 첫째, createAction사용해서 LOG_IN타입을 넘겨준다. ()안에는 파라미터 값 즉 정보를 주고 user값을 넘겨준다.
const setUser = createAction(SET_USER, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));

// 4. initialState(초기값)을 잡아준다.
const initialState = {
  user: null,
  is_login: false,
};

const user_initial = {
  user_name: "kbs",
};

//미들웨어 actions
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    // 로그인 상태를 기억하기 위한 코드
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      //로그인 구현
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          console.log(user);
          dispatch(
            setUser({ user_name: user.displayName, id: id, user_profile: "" })
          );
          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        auth.currentUser
          .updateProfile({
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({ user_name: user_name, id: id, user_profile: "" })
            );
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

// 5. reducer(리듀서)
export default handleActions(
  {
    // state와 action을 넘겨준다.
    // immer를 사용해줄 것이다.
    // {}여기 안에서 일어나는 작업을 불변성관리를 해줄 것이다.
    // produce를 사용하려면 원본값은 ()괄호안에 줘야한다.
    // 원본값을 복사한 값을 immer가 넘겨줘야하는데 우리는 draft라고 설정해 받아온다.
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        // 쿠기를 추가하기위해 setCookie를 넣어준다(is_login자리에는 원래 토큰이 들어가야한다).
        setCookie("is_login", "success");
        // action안에 payload라는 값안에 우리가보낸 데이터들이 다 들어가 있다. payload를 사용
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);
// 6. action creator export
// 액션생성함수를 내보낸다.
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
};
export { actionCreators };
