import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import dotenv from "dotenv";
import "firebase/analytics";
dotenv.config();

require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// 초기화해준다.
firebase.initializeApp(firebaseConfig);

// apiKey를 내보낸다.
const apiKey = firebaseConfig.apiKey;

// 파이어베이스를 가지고온다.
// 인증을 만들어준다.
const auth = firebase.auth();

// 파이어스토어를 사용한다.
const firestore = firebase.firestore();

// 파이어베이스의 스토리지를 사용한다.
const storage = firebase.storage();

const realtime = firebase.database();
const analytics = firebase.analytics();

export { auth, apiKey, firestore, storage, realtime, analytics };
