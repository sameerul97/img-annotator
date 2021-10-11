import { Dispatch } from "react";

import { ActionType } from "../action-types";
import * as api from "../../../api/index.js";

import { Action } from "../actions/index"


export const getAllImages = (page_no: number, image_name?: string) => async (dispatch: Dispatch<Action>) => {
  try {
    dispatch({ type: ActionType.FETCH_START_LOADING });
    const { data } = await api.fetchImages(page_no, image_name);

    dispatch({
      type: ActionType.FETCH_ALL_IMAGES,
      payload: { images: data.images, total_pages: data.total_pages },
    });
    dispatch({ type: ActionType.FETCH_END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const fetchImagesBySearch =
  (page_no: number, image_name: string) => async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.FETCH_IMAGES_BY_SEARCH,
        payload: {
          image_name: image_name,
        },
      });
      dispatch({ type: ActionType.FETCH_END_LOADING });
    } catch (error) {
      console.log(error);
    }
  };

export const ViewAllImages = () => async (dispatch: Dispatch<Action>) => {
  try {
    dispatch({
      type: ActionType.RESET_ALL_IMAGES,
    });
  } catch (error) {
    console.log(error);
  }
};
