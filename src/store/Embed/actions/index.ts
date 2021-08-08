import { ActionType } from "../action-types"
import type { Popup, SelectedMarker } from '../types'

interface SetSelectedPopupAction {
    type: ActionType.SET_SELECTED_POPUP,
    payload: {
        popup: Popup[],
        selectedMarker: SelectedMarker
    }
}

interface CloseSelectedPopupAction {
    type: ActionType.CLOSE_SELECTED_POPUP
}

interface SetLoadingAction {
    type: ActionType.SET_LOADING
}

export type Action = SetSelectedPopupAction | CloseSelectedPopupAction | SetLoadingAction;