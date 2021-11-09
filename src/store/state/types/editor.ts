export interface Marker {
    animation_type: string;
    background_color: string;
    border_radius: string;
    color: string;
    left: Number;
    m_id: Number;
    marker_image: string;
    marker_type: string;
    popup_id: Number;
    top: Number;
}

export interface PopupContent {
    id: String;
    marker_id: Number;
    order_no: String;
    src: String;
    widget_type_id: String;
}

export interface Popup {
    id: Number;
    popup_content: PopupContent[]
}

export interface Image {
    copy: string;
    header: string
    id: string
    marker_positions: Marker[]
    name: string;
    script: string;
    url: string;
}

export interface EditorState {
    toast: boolean;
    loading: boolean;
    image: Image,
    popup: Popup[],
    image_not_found_error: Boolean,
    image_not_found_error_message: String
}