import React from "react";
import styled from "styled-components";
import { Image } from "../elements";

const NotFound = (props) => {
  return (
    <div style={{ position: "absolute" }}>
      <img src="https://media.vlpt.us/images/kbs2082/post/3eb1d787-ff7e-48e8-b489-d6fa7f083b94/dog.jpg"></img>
      <h1>Coming soon.</h1>
      <Div1></Div1>
      <Div2></Div2>
    </div>
  );
};

const Div1 = styled.div`
  position: relative;
  z-index: 1;
  background-color: red;
  width: 100px;
  height: 100px;
`;

const Div2 = styled.div`
  position: relative;
  z-index: 2;
  background-color: beige;
  width: 100px;
  height: 100px;
`;
export default NotFound;
