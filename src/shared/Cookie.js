// 키값 기준으로 쿠키에 저장된 값을 가져오는 함수
const getCookie = (name) => {
  // 쿠키 값을 가져옵니다.
  let value = "; " + document.cookie;
  // 키 값을 기준으로 파싱합니다.
  let parts = value.split(`; ${name}=`);
  // value를 return!
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

// exp = 5라는 뜻은 기본값을 미리 넣어주는 것이다.
// 쿠키에 저장하는 함수
const setCookie = (name, value, exp = 5) => {
  let date = new Date();
  // 날짜를 만들어줍니다.
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  // 저장!
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) => {
  // 만료일을 예전으로 설정해 쿠키를 지웁니다.
  let date = new Date("2020-01-01").toUTCString();
  console.log(date);
  document.cookie = name + "=; expires=" + date;
};

export { getCookie, setCookie, deleteCookie };
