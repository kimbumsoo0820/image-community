import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text } from "../elements/index";

const Post = (props) => {
  console.log("나요 나" + props);
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
          <Image shape="circle" src={props.src} />
          <Text bold>{props.user_info.user_name}</Text>
          <Text>{props.insert_dt}</Text>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>

        <Grid>
          <Image shape="rectangle" src={props.src}></Image>
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
        {/* <div>user Profile / user name / insert_dt / is_me (edit btn)</div>
        <div> contents</div>
        <div>image</div>
        <div>comment cont</div> */}
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "kim",
    user_profile:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA5MjRfMjIx%2FMDAxNjMyNDE1MDM5Nzk2.Tn3xVJHw4VAM-VQklFQlmrmEzcFi9Vrkm1wJ926w3jUg.NoQ_5eyTi8HbK-des5oJMgwtIUIMF8-EzBJHNiogbTMg.JPEG.rkfka1217%2F20190218%25A3%25DF161309%25A3%25DFIMG%25A3%25DF6797.JPG&type=sc960_832",
  },
  image_url:
    "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA5MjRfMjIx%2FMDAxNjMyNDE1MDM5Nzk2.Tn3xVJHw4VAM-VQklFQlmrmEzcFi9Vrkm1wJ926w3jUg.NoQ_5eyTi8HbK-des5oJMgwtIUIMF8-EzBJHNiogbTMg.JPEG.rkfka1217%2F20190218%25A3%25DF161309%25A3%25DFIMG%25A3%25DF6797.JPG&type=sc960_832",
  contents: "고냥이",
  comment_cnt: 10,
  insert_dt: "2021-09-30 10:00:00",
};

export default Post;
