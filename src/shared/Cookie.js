const getCookie = (name) => {
  let value = "; " + document.cookie; // document 앞에 ; (띄어쓰기) 를 안붙이면 cookie의 맨 앞 값인 user_id 값이 split이 안된다.

  let parts = value.split(`; ${name}=`); // aa=xx; user_id=aaa  이럴때 ; user_id= 로 자르면 값만 반환되기 때문에 튜터님이 이렇게 자르심
  // [aa=xx/ aaa; abbb=ssss;]  앞에 친구 버리고 뒷 친구만 가져오려면?  - 잘 이해안됨

  // pop 과 shift 를 자세히 알아보기! 서로 반대의 개념

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

const setCookie = (name, value, exp = 5) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) => {
  let date = new Date("2020-01-01").toUTCString();

  document.cookie = name + "=; expires=" + date;
};

export { getCookie, setCookie, deleteCookie };
