import React from "react";
import styled from "styled-components";

const Image = (props) => {
  const { shape, src, size } = props;

  const styles = {
    src: src,
    size: size,
  };

  if (shape === "circle") {
    return <ImageCircle {...styles}></ImageCircle>;
  }

  if (shape === "rectangle") {
    return (
      <Aspectoutter>
        <AspectInner {...styles}></AspectInner>
      </Aspectoutter>
    );
  }

  return <React.Fragment></React.Fragment>;
};

Image.defaultProps = {
  shape: "circle",
  src: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA5MjRfMjIx%2FMDAxNjMyNDE1MDM5Nzk2.Tn3xVJHw4VAM-VQklFQlmrmEzcFi9Vrkm1wJ926w3jUg.NoQ_5eyTi8HbK-des5oJMgwtIUIMF8-EzBJHNiogbTMg.JPEG.rkfka1217%2F20190218%25A3%25DF161309%25A3%25DFIMG%25A3%25DF6797.JPG&type=sc960_832",
  size: 36,
};

const Aspectoutter = styled.div`
  width: 100%auto;
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
