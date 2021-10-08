import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../elements";
import { storage } from "./firebase";

import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const fileInput = React.useRef();
  const is_uploading = useSelector((state) => state.image.uploading);

  const selectFile = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.files[0]);

    console.log(fileInput.current.files[0]);

    const reader = new FileReader();
    const file = fileInput.current.files[0];
    // 파일내용 읽어옴
    reader.readAsDataURL(file);

    //읽기가 끝나면 받아온다
    reader.onloadend = () => {
      //미리보기 사진 넣어줌
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    let image = fileInput.current.files[0];
    // firebase Storage에 업로드 하는 구문  storage의 images 파일 안에 파일 이름을 넣는 작업. 마지막에 put으로 무엇을 넣을것인가.
    const _upload = storage.ref(`images/${image.name}`).put(image);

    _upload.then((snapshot) => {
      console.log(snapshot);

      snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
      });
    });
  };
  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading}
      />
    </React.Fragment>
  );
};

export default Upload;
