import React from "react";
import styled from "styled-components";

// Image 함수형 컴포넌트를 만들어 준다.
const Image = (props) => {
  const { shape, src, size, _onClick } = props;

  const styles = {
    src: src,
    size: size,
  };

  if (shape === "circle") {
    return <ImageCircle {...styles} onClick={_onClick}></ImageCircle>;
  }

  if (shape === "rectangle") {
    return (
      <AspectOutter>
        <AspectInner {...styles} onClick={_onClick}></AspectInner>
      </AspectOutter>
    );
  }
  return (
    <React.Fragment>
      <ImageDefault {...styles} onClick={_onClick}></ImageDefault>
    </React.Fragment>
  );
};

Image.defaultProps = {
  shape: "circle",
  src: "https://s3.ap-northeast-2.amazonaws.com/bucketlist.me/D6BA7E66-5A99-46E8-8D64-1FF6F1C0351C.jpeg",
  size: 36,
  _onClick: () => {},
};

const ImageDefault = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

const AspectOutter = styled.div`
  width: auto;
  min-width: 250px;
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
  margin: 4px;
`;

export default Image;
