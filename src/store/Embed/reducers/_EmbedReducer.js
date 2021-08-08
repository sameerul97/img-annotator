function EmbedReducer(state, action) {
  switch (action.type) {
    case "SET_SELECTED_POPUP": {
      return {
        ...state,
        popup: action.payload.popup,
        // selectedPopup: action.payload.selectedPopup,
        selectedMarker: action.payload.selectedMarker,
        loading: false,
      };
    }

    case "CLOSE_SELECTED_POPUP": {
      return {
        ...state,
        // selectedPopup: null,
        popup: null,
        selectedMarker: null,
        loading: false,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        loading: true,
      };
    }

    default:
      throw new Error();
  }
}
export default EmbedReducer;
