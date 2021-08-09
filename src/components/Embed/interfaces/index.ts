interface PopupArrowProps {
  isMobileScreen: boolean;
  top: number;
  width: number;
  isLeft: boolean;
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

export type { PopupArrowProps, WidgetSrc, CarouselSlide };
