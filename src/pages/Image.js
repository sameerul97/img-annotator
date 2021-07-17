import React from "react";
import HotspotImage from "../components/HotspotImage";

function Image(props) {
  console.log(props);
  return <HotspotImage id={props.match.params} />;
}

export default Image;
