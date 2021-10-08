// 포스트 목록가지고오기!

// 1. import
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

// 2. 액션만들기!
// 첫째, 목록가지고 오면 넣어주는 역할을 하는 액션을 만든다.
const SET_POST = "SET_POST";
// 둘째, 목록을 추가해주는 것을 만들어 준다.
const ADD_POST = "ADD_POST";

const EDIT_POST = "EDIT_POST";

const LOADING = "LOADING";

// 3. action creator(액션 생성 함수들)
const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// 4. initialState(초기값)을 잡아준다.`
const initialState = {
  list: [],
  //첫째, 페이징(paging)처리하기[무한스크롤]!
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "이승민",
  //   user_profile:
  //     "https://s3.ap-northeast-2.amazonaws.com/bucketlist.me/D6BA7E66-5A99-46E8-8D64-1FF6F1C0351C.jpeg",
  // },
  // 게시글에 붙어있는 이미지
  image_url:
    "https://s3.ap-northeast-2.amazonaws.com/bucketlist.me/D6BA7E66-5A99-46E8-8D64-1FF6F1C0351C.jpeg",
  contents: "",
  comment_cnt: 0,
  // 오늘 날짜가 moment객체로 나온다.
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  good_user: [],
};

// middleware actions, 포스트를 가지고 올 것이다.

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    // 유저정보를 넣어준다.
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;
    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;

    if (_paging.start && !_paging.next) {
      return;
    }

    dispatch(loading(true));
    const postDB = firestore.collection("post");

    // 쿼리가져오기. desc는 역순으로 정렬해준다.
    let query = postDB.orderBy("insert_dt", "desc");
    //startAt 이라는 쿼리의 시작점을 가리키는 코드. 어디서부터 가져올건지.
    if (start) {
      query = query.startAt(start);
    }

    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          let _post = doc.data();

          // 배열로 만들어준다.
          // ['comment_cnt', 'contents', ...]

          //reduce는 배열의 내장함수 filter나 map과 비슷함 MDN 참고
          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              if (cur.indexOf("user_") !== -1) {
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );
          post_list.push(post);
        });

        post_list.pop();

        dispatch(setPost(post_list, paging));
      });

    return;
  };
};

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        console.log(doc);
        console.log(doc.data());
        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );
        dispatch(setPost([post]));
      });
  };
};

// 좋아요 유저 수정하는 부분
const SetGoodFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);

    const _post = getState().post.list[_post_idx];
    console.log("소크라테스", _post);
    const user_info = getState().user.user;

    // db에 넣기 위해 post를 다시 만들어준다. (기존의 post에 good_user를 넣음)
    const post = {
      // ..._post,
      good_user: [..._post.good_user, user_info.uid],
    };
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .update(post)
      .then((doc) => {
        dispatch(editPost(post_id, { ...post }));
      });
  };
};

const DeleteGoodFB = (post_id = null) => {
  return function (dispatch, getState) {
    //post.list 가 어디인지
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    const user_info = getState().user.user;
    const postDB = firestore.collection("post");

    const result = _post.good_user.filter((good) => good !== user_info.uid);

    const post = {
      // ..._post,
      good_user: result,
    };

    postDB
      .doc(post_id)
      .update(post)
      .then((doc) => {
        dispatch(editPost(post_id, { ...post }));
      });
  };
};

// 5. 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        // 리듀서 사용해서 중복값 제거
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.pagin = action.payload.paging;
        }

        draft.paging = action.payload.paging;
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getPostFB,
  SetGoodFB,
  DeleteGoodFB,
};

export { actionCreators };
