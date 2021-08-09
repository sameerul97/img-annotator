import React from "react";
import { WidgetSrc } from "../interfaces";

function PopupImageWidget({ src }: WidgetSrc) {
  return <img src={src} alt="empty" className="img-fluid" />;
}

export default PopupImageWidget;
