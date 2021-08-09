interface PopupArrowProps {
  isMobileScreen: boolean;
  top: number;
  width: number;
  isLeft: boolean | undefined;
}

interface CarouselSlide {
  caption: string;
  id: string;
  order_no: number;
  slide_type: string;
  src: string;
}

interface WidgetSrc {
  src: string;
}

interface Marker {
  animation_type: string;
  background_color: string;
  border_radius: string;
  color: string;
  left: number;
  m_id: string;
  marker_image: string;
  marker_type: string;
  popup_id: number;
  top: number;
}

interface HotspotProps {
  markers: Marker;
  width: number;
  hotspotClicked: (text: string) => void;
}

interface PopupProps {
  markers: Marker;
  naturalImageWidth: number;
  width: number;
}

interface PopupStyle {
  top: number;
  left?: number;
  right?: number;
}

interface PopupItem {
  id: string;
  marker_id: number;
  order_no: string;
  src: string;
  widget_type_id: string;
}

export type { PopupArrowProps, WidgetSrc, CarouselSlide, HotspotProps, PopupProps, PopupStyle, PopupItem };
