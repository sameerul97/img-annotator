import { ActionType } from "../action-types";
import { Action } from "../actions"
import { ImagesState } from "../types/images";

const initialState = {
  isLoading: true,
  images: [],
  total_pages: 0,
  current_page: "",
  search: false,
  search_query: {
    image_name: "",
  },
};

export default (state: ImagesState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.FETCH_START_LOADING:
      return { ...state, isLoading: true };
    case ActionType.FETCH_END_LOADING:
      return { ...state, isLoading: false };
    case ActionType.RESET_ALL_IMAGES:
      return {
        ...state,
        search: false,
        search_query: {
          image_name: "",
        },
      }
    case ActionType.FETCH_IMAGES_BY_SEARCH:
      return {
        ...state,
        search: true,
        search_query: {
          image_name: action.payload.image_name,
        },
      };
    case ActionType.FETCH_ALL_IMAGES:
      return {
        ...state,
        images: action.payload.images,
        total_pages: action.payload.total_pages,
      };
    default:
      return state;
  }
};
