import React, { useState, useEffect, useContext } from "react";

import useCheckMobileScreen from "../../hooks/useCheckMobileScreen";
import { Context } from "../../store/EmbedStore";

import PopupImageWidget from "./PopupWidgets/PopupImageWidget";
import PopupVideoWidget from "./PopupWidgets/PopupVideoWidget";
import PopupTextWidget from "./PopupWidgets/PopupTextWidget";
import PopupButtonWidget from "./PopupWidgets/PopupButtonWidget";
import PopupCarouselWidget from "../Editor/PopupWidgets/PopupCarouselWidget";

import { Widget_ID } from "../Widgets";

const Popup = (props) => {
  const [popupStyle, setPopupStyle] = useState();
  const [iframeSrc, setIframeSrc] = useState();
  const isMobileScreen = useCheckMobileScreen();
  const [isLeft, setIsLeft] = useState();
  const [widgets, setWidgets] = useState();

  const [state] = useContext(Context);

  const WidgetSelected = ({ item }) => {
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

      // case Widget_ID.CarouselWidget:
      //   return <PopupCarouselWidget />;

      default:
        return;
    }
  };

  useEffect(() => {
    // setWidgets(props.widgets);
    // setIframeSrc(props.widgets);
  }, [props]);

  useEffect(() => {
    let _width = props.width;
    let _naturalImageWidth = props.naturalImageWidth;

    let _left = isNaN((props.markers.left * _width) / _naturalImageWidth)
      ? 0
      : parseFloat((props.markers.left * _width) / _naturalImageWidth);

    let _top = isNaN((props.markers.top * _width) / _naturalImageWidth)
      ? 0
      : parseFloat((props.markers.top * _width) / _naturalImageWidth) / 2;

    if (!isMobileScreen) {
      if (_left >= (_width / 100) * 58) {
        setPopupStyle({
          top: _top,
          right: _width - _left + 25,
        });
        setIsLeft(false);
      } else {
        setPopupStyle({
          top: _top,
          left: _left,
        });
        setIsLeft(true);
      }
    }
  }, [
    props.markers.top,
    props.markers.left,
    props.width,
    props.naturalImageWidth,
    isMobileScreen,
  ]);

  return (
    <div style={popupStyle} className="pointBox showflip smoothTransition">
      <PopupBoxArrow
        isLeft={isLeft}
        isMobileScreen={isMobileScreen}
        top={props.markers.top}
        width={props.width / props.naturalImageWidth}
      />
      <PopupCloseButton />

      <div className="popup_widgets">
        {state.popup.map((item, index) => (
          <React.Fragment key={item.id}>
            {WidgetSelected({ item: item })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Popup;

const PopupBoxArrow = ({ isMobileScreen, top, width, isLeft }) => {
  const arrowStyle = {
    top: parseFloat(top * width) / 2 + 25,
    right: !isLeft ? -18 : "unset",
    left: isLeft ? -17 : "unset",
  };

  return (
    <div className="pointBoxArrow smoothTransition" style={arrowStyle}>
      {!isLeft ? (
        <svg
          width="20"
          className="pointBoxArrowRight d-block"
          height="53"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192 512"
        >
          <path
            fill="#ffffff"
            d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"
          ></path>
        </svg>
      ) : (
        <svg
          width="20"
          className="pointBoxArrowLeft d-block"
          height="53"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192 512"
        >
          <path
            fill="#ffffff"
            d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
          ></path>
        </svg>
      )}
    </div>
  );
};

const PopupCloseButton = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div
      className="pointBoxClose exit"
      onClick={() => {
        dispatch({ type: "CLOSE_SELECTED_POPUP" });
      }}
    >
      <div className="pointBoxCloseIcon">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="black" strokeWidth="1">
            <path d="M2 14L14 2M2 2l12 12"></path>
          </g>
        </svg>
      </div>
    </div>
  );
};
