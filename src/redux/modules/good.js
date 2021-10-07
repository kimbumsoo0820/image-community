import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";

import firebase from "firebase";
import { actionCreators as postActions } from "./post";
