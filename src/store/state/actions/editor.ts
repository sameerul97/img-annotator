import { Image } from "../../../interfaces";
import { ActionType as EditorActionType } from "../action-types/editor";
import { Popup } from "../types/editor";

interface SetToast {
    type: EditorActionType.SET_TOAST;
    payload: boolean;
}

interface SetImage {
    type: EditorActionType.SET_IMAGE;
    payload: Image;
}

interface SetPopup {
    type: EditorActionType.SET_POPUP;
    payload: Popup
}

interface StartLoading {
    type: EditorActionType.START_LOADING;
}

interface EndLoading {
    type: EditorActionType.END_LOADING;
}

interface SetImageNotFound {
    type: EditorActionType.IMAGE_NOT_FOUND;
    payload: {
        image_not_found_error: boolean;
        image_not_found_error_message: String;
    }
}
export type Action = SetToast | SetImage | StartLoading | EndLoading | SetPopup | SetImageNotFound;