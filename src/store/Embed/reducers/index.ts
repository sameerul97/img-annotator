import { ActionType } from "../action-types/index"
import { Action } from "../actions"
import type { InitialStateType } from '../types'

const reducer = (state: InitialStateType, action: Action): InitialStateType => {
    switch (action.type) {
        case ActionType.SET_SELECTED_POPUP: {
            return {
                ...state,
                popup: action.payload.popup,
                selectedMarker: action.payload.selectedMarker,
                loading: false,
            };
        }

        case ActionType.CLOSE_SELECTED_POPUP: {
            return {
                ...state,
                popup: [],
                selectedMarker: null,
                loading: false,
            };
        }

        case ActionType.SET_LOADING: {
            return {
                ...state,
                loading: true,
            };
        }


        default:
            return state;
    }
}

export default reducer