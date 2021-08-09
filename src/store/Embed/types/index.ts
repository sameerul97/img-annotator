type Popup = {
  id: string,
  widget_type_id: string,
  order_no: string,
  src: string,
  marker_id: number
};

type SelectedMarker = {
  m_id: number,
  top: number,
  left: number,
  color: string,
  animation_type: string,
  marker_type: string,
  marker_image: string,
  background_color: string,
  border_radius: string,
  popup_id: number
};

type InitialStateType = {
  popup: Array<Popup>;
  selectedMarker: SelectedMarker | null;
  selectedPopup: null;
  error: string | null;
  loading: boolean;
};

export type { Popup, SelectedMarker, InitialStateType };
