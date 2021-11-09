import { ActionType as EditorActionType } from "../action-types/editor";
import { EditorState } from "../types/editor";
import { Action as EditorActions } from "../actions/editor";

const initialState = {
    toast: false,
    loading: true,
    image: {
        copy: "",
        header: "",
        id: "",
        marker_positions: [],
        name: "",
        script: "",
        url: "",
    },
    popup: [],
    image_not_found_error: false,
    image_not_found_error_message: "",
};

const editorReducer = (state: EditorState = initialState, action: EditorActions) => {
    switch (action.type) {
        case EditorActionType.SET_TOAST:
            return {
                ...state,
                toast: action.payload,
            }

        case EditorActionType.SET_IMAGE:
            return {
                ...state,
                image: action.payload,
            }

        case EditorActionType.IMAGE_NOT_FOUND:
            return {
                ...state,
                image_not_found_error: action.payload.image_not_found_error,
                image_not_found_error_message: action.payload.image_not_found_error_message,
            }

        case EditorActionType.SET_POPUP:
            return {
                ...state,
                popup: action.payload,
            }

        case EditorActionType.START_LOADING:
            return {
                ...state,
                loading: true,
            }

        case EditorActionType.END_LOADING:
            return {
                ...state,
                loading: false,
            }

        default:
            return state;
    }
}


export default editorReducer;