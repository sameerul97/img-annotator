import { ActionType } from "../action-types/index"
import { Image } from "../types";


interface FetchStartLoading {
    type: ActionType.FETCH_START_LOADING
}

interface FetchEndLoading {
    type: ActionType.FETCH_END_LOADING
}

interface FetchAllImages {
    type: ActionType.FETCH_ALL_IMAGES,
    payload: {
        images: Image[],
        total_pages: any
    }
}

interface FetchImagesBySearch {
    type: ActionType.FETCH_IMAGES_BY_SEARCH,
    payload: {
        image_name: string
    }
}

interface ResetAllImages {
    type: ActionType.RESET_ALL_IMAGES
}

export type Action = FetchAllImages | FetchStartLoading | FetchEndLoading | ResetAllImages | FetchImagesBySearch;
