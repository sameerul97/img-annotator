import { combineReducers } from "redux";

import images from "./images";
import auth from "./auth";
import editor from "./editor";

export const reducers = combineReducers({ images, auth, editor });
