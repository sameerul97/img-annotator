import React from "react";
import HotspotImageEditor from "../components/Editor/HotspotImage";

function Image(props) {
  return <HotspotImageEditor id={props.match.params} />;
}

export default Image;
