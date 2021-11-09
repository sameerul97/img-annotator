import { Dispatch } from "react";
import * as api from "../../../api/index.js";
import { ParseData } from "../../../utils/ParseImageData";


import { ActionType } from "../action-types/editor";
import { Action } from "../actions/editor"

export const setToast = (toast: boolean) => async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_TOAST, payload: toast });
}

export const getImage = (image_id: number) => async (dispatch: Dispatch<Action>) => {
    try {
        dispatch({ type: ActionType.START_LOADING });

        const { data } = await api.fetchImage(image_id);
        const [fetchedImage, popupContent] = await ParseData(data);

        dispatch({ type: ActionType.SET_IMAGE, payload: fetchedImage });
        dispatch({ type: ActionType.SET_POPUP, payload: popupContent });
        dispatch({
            type: ActionType.IMAGE_NOT_FOUND, payload: {
                image_not_found_error: false,
                image_not_found_error_message: ""
            }
        });
        dispatch({ type: ActionType.END_LOADING });


    } catch (error: any) {
        console.log(error);

        let errorResponse = error.response;

        if (errorResponse.status === 404) {
            dispatch({
                type: ActionType.IMAGE_NOT_FOUND, payload: {
                    image_not_found_error: true,
                    image_not_found_error_message: errorResponse.data.message
                }
            });
        }

        dispatch({ type: ActionType.END_LOADING });
    }
}