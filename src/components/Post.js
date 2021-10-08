import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
// memo로 자식컴포넌트를 메모이제이션 해서 부모 컴포넌트가 바뀌어도 자식 컴포넌트는 렌더링 수를 줄인다.

const Post = React.memo((props) => {
  const user_info = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [found, setFound] = useState(null);

  const setGood = (post_id) => {
    console.log("구분", post_id);
    dispatch(postActions.SetGoodFB(post_id));
  };

  const deleteGood = (post_id) => {
    console.log("구분", post_id);
    dispatch(postActions.DeleteGoodFB(post_id));
  };

  // 로그인 안한 유저를 위한 처리 (로그인을 안하면 user_info가 없어서 에러가 났음)
  useEffect(() => {
    if (user_info) {
      const goodArr = props.good_user;
      console.log("tes", goodArr);

      const founded = goodArr.find((e) => e == `${user_info.uid}`);

      setFound(founded);
    }
  }, [props.good_user]);

  return (
    <React.Fragment>
      <Grid>
        {/* 상단바 */}
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Grid>
              <Image shape="circle" src={props.src} />
            </Grid>
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button
                width="auto"
                margin="4px"
                padding="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
          </Grid>
        </Grid>

        {/* text바 */}
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>

        {/* {/* 이미지바 */}
        <Grid>
          <Image
            shape="rectangle"
            src={props.image_url}
            _onClick={() => {
              history.push(`post/${props.id}`);
            }}
          />
        </Grid>
        {/* 댓글바 */}
        <Grid padding="16px" is_flex>
          <Text margin="0px" bold>
            좋아요 {props.good_user.length}개
          </Text>
          {/* found (유저가 좋아요를 눌렀는지 안눌렀는지) 와 user_info(로그인 했는지 안했는지) 경우의 수를 나눔 로그인 안하면 하트가 안보임*/}
          {found && user_info && (
            <HeartButton
              onClick={() => {
                deleteGood(props.id);
              }}
            >
              <i className="fas fa-heart"></i>
            </HeartButton>
          )}
          {!found && user_info && (
            <HeartButton
              onClick={() => {
                setGood(props.id);
              }}
            >
              <i className="far fa-heart"></i>
            </HeartButton>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

//props가 없어서 오류가 난다던가 아니면 화면이 없어서 깨져버리는 일이 없다.
Post.defaultProps = {
  user_info: {
    user_name: "kbs",
    user_profile:
      "https://s3.ap-northeast-2.amazonaws.com/bucketlist.me/D6BA7E66-5A99-46E8-8D64-1FF6F1C0351C.jpeg",
  },
  // 게시글에 붙어있는 이미지
  image_url:
    "https://s3.ap-northeast-2.amazonaws.com/bucketlist.me/D6BA7E66-5A99-46E8-8D64-1FF6F1C0351C.jpeg",
  cotents: "강아지네요!",
  comment_cnt: 10,
  insert_dt: "2021-09-20 10:00:00",
  is_me: false,
  is_good: false,
};

const HeartButton = styled.button`
  border: none;
  background-color: white;
  font-size: 25px;
  color: lightpink;
`;

export default Post;
