import { EditorState } from "./editor";
import { ImagesState } from "./images";

export interface Image {
    id: String,
    url: String
    name: String
}

export interface Store {
    images: ImagesState, editor: EditorState
}