import { combineReducers } from "redux";

import posts from "./images";
import auth from "./auth";

export const reducers = combineReducers({ posts, auth });
