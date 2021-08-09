import React, { useState, useEffect, useContext } from "react";

import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";
import { EmbedContext } from "../../store/Embed";

import PopupImageWidget from "./PopupWidgets/PopupImageWidget";
import PopupVideoWidget from "./PopupWidgets/PopupVideoWidget";
import PopupTextWidget from "./PopupWidgets/PopupTextWidget";
import PopupButtonWidget from "./PopupWidgets/PopupButtonWidget";
import PopupCarouselWidget from "./PopupWidgets/PopupCarouselWidget";
import PopupArrow from "./PopupArrow";
import PopupClose from "./PopupClose";

import { Widget_ID } from "../Widgets";
import { PopupProps, PopupStyle, PopupItem } from "./interfaces";

const Popup = (props: PopupProps) => {
  const [popupStyle, setPopupStyle] = useState<PopupStyle>();
  const [isLeft, setIsLeft] = useState<boolean>();

  const isMobileScreen = useCheckMobileScreen();
  const { state } = useContext(EmbedContext);

  const WidgetSelected = (item: PopupItem) => {
    switch (item.widget_type_id) {
      case Widget_ID.ImageWidget:
        return <PopupImageWidget src={item.src} />;

      case Widget_ID.HeaderWidget:
        return <PopupTextWidget src={item.src} />;

      case Widget_ID.ParagraphWidget:
        return <PopupTextWidget src={item.src} />;

      case Widget_ID.ButtonWidget:
        return <PopupButtonWidget src={item.src} />;

      case Widget_ID.VideoWidget:
        return <PopupVideoWidget src={item.src} />;

      case Widget_ID.FreeTextWidget:
        return <PopupVideoWidget src={item.src} />;

      case Widget_ID.CarouselWidget:
        return <PopupCarouselWidget src={item.src} />;

      default:
        return;
    }
  };

  useEffect(() => {
    let _width = props.width;
    let _naturalImageWidth = props.naturalImageWidth;

    let _left = isNaN((props.markers.left * _width) / _naturalImageWidth)
      ? 0
      : (props.markers.left * _width) / _naturalImageWidth;

    let _top = isNaN((props.markers.top * _width) / _naturalImageWidth)
      ? 0
      : (props.markers.top * _width) / _naturalImageWidth / 2;

    if (!isMobileScreen) {
      if (_left >= (_width / 100) * 58) {
        setPopupStyle({
          top: _top,
          right: _width - _left + 25
        });
        setIsLeft(false);
      } else {
        setPopupStyle({
          top: _top,
          left: _left
        });
        setIsLeft(true);
      }
    }
  }, [
    props.markers.top,
    props.markers.left,
    props.width,
    props.naturalImageWidth,
    isMobileScreen
  ]);

  return (
    <div style={popupStyle} className="pointBox showflip smoothTransition">
      <PopupArrow
        isLeft={isLeft}
        isMobileScreen={isMobileScreen}
        top={props.markers.top}
        width={props.width / props.naturalImageWidth}
      />

      <PopupClose />

      <div className="popup_widgets">
        {state.popup.map((item: PopupItem) => (
          <React.Fragment key={item.id}>{WidgetSelected(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Popup;
