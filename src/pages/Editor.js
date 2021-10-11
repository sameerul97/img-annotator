import React from "react";
import HotspotImageEditor from "../components/Editor/HotspotImage";

function Editor(props) {
  return <HotspotImageEditor id={props.match.params} />;
}

export default Editor;
