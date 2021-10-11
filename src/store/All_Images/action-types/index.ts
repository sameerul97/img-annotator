export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

// Images
export const FETCH_IMAGES_BY_SEARCH = 'FETCH_IMAGES_BY_SEARCH';
export const RESET_IMAGES_STATE = 'RESET_IMAGES_STATE';

export const FETCH_ALL = 'FETCH_ALL';
export const FETCH_BY_SEARCH = 'FETCH_BY_SEARCH';
export const FETCH_POST = 'FETCH_POST';
export const LIKE = 'LIKE';
export const COMMENT = 'COMMENT';
export const END_LOADING = 'END_LOADING';
export const START_LOADING = 'START_LOADING';
export const FETCH_BY_CREATOR = 'FETCH_BY_CREATOR';

export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';

export enum ActionType {
    FETCH_ALL_IMAGES = "FETCH_ALL",
    FETCH_START_LOADING = "START_LOADING",
    FETCH_END_LOADING = "END_LOADING",
    FETCH_IMAGES_BY_SEARCH = 'FETCH_IMAGES_BY_SEARCH',
    RESET_ALL_IMAGES = 'RESET_IMAGES_STATE'
}
