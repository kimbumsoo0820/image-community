// 리덕스

// 1.import
// 첫째,createAction와 handleActions는 Action과 리듀서를 편하게 만들어준다.
import { createAction, handleActions } from "redux-actions";
// 둘째, immer를 가지고와야 불변성관리가 편하다.
import { produce } from "immer";
// 셋째, 쿠키를 가져온다.
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
// firebase불러오기.
import firebase from "firebase/app";

// 2. actions(액션타입)
// 첫째, 로그인 정보를 가지고 온다.
//const LOG_IN = "LOG_IN";
// 둘째, 로그아웃 정보를 가지고 온다.
const LOG_OUT = "LOG_OUT";
// 셋째, 유저정보를 가지고 온다.
const GET_USER = "GET_USER";
// 넷째, 유저정보를 가져온다.
const SET_USER = "SET_USER";

// 3. action creator(액션 생성 함수들)
// 첫째, createAction사용해서 LOG_IN타입을 넘겨준다. ()안에는 파라미터 값 즉 정보를 주고 user값을 넘겨준다.
//const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// 4. initialState(초기값)을 잡아준다.
const initialState = {
  // 로그인을 안한상태기 때문에 null(아직 사용자가 없기 때문에 로그인정보 없음)
  user: null,
  // 웹사이트 뜨자마 아직 아무것도 안되어 있기때문에 false
  is_login: false,
};

// 유저에 대한 intial을 만들어준다.
const user_intial = {
  user_name: "lsm",
};

// 7. middleware actions
// const loginAction = (user) => {
//   // state를 받을 때 getState를 사용해 받아서 쓸수 있다.
//   return function (dispatch, getState, { history }) {
//     console.log(history);
//     // 유저정보로 로그인 값을 넘겨준다.
//     dispatch(setUser(user));
//     // 메인페이지로 이동한다.
//     history.push("/");
//   };
// };
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          console.log(user);
          // 로그인한 다음에 일어날 일!
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: "",
              uid: user.user.uid,
            })
          );

          history.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    // firebase에 이미 auth를 설정해주었기 때문에 auth라고 적어준다.
    auth
      .createUserWithEmailAndPassword(id, pwd)
      // createUserWithEmailAndPassword완료가 되면 user라는 정보가 넘어온다.
      .then((user) => {
        console.log(user);

        // 사용자 프로필 업데이트
        auth.currentUser
          .updateProfile({
            displayName: user_name,
            // 성공했을 때 then안으로 들어온다.
          })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.user.uid,
              })
            );
            history.push("/login");
          })
          .catch((error) => {
            console.log(error);
          });
        // Signed in
        // ...
      })
      // 오류가 발생하면 아래와 같이 실행한다.
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

// 새로고침 됬을 때 리덕스에 있는 로그인정보가 날아가니깐 세션에서 다시 리덕스에 넣어주기 위한 함수
const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    // onAuthStateChanged는 유저가 있는지 없는지 확인하는 것이다.
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  };
};

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    auth.signOut().then(() => {
      dispatch(logOut());
      // replace는 괄호안에 있는 것과 지금 있는페이지를 바꿔치기한다는 뜻이다.
      history.replace("/");
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
        // action안에 payload라는 값안에 우리가보낸 데이터들이 다 들어가 있다.
        draft.user = action.payload.user;
        // is_login이 false이기 때문에 true로 바꿔준다.
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
  //logIn,
  logOut,
  getUser,
  //loginAction,
  loginFB,
  signupFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
