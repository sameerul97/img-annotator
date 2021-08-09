import React, { useState, useEffect } from "react";
import { HotspotProps } from "./interfaces";

const Hotspot = (props: HotspotProps) => {
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);

  useEffect(() => {
    setTop(
      isNaN(props.markers.top * props.width)
        ? 0
        : props.markers.top * props.width
    );

    setLeft(
      isNaN(props.markers.left * props.width)
        ? 0
        : props.markers.left * props.width
    );
  }, [props.markers.top, props.markers.left, props.width]);

  return (
    <div
      className={`item-point circle pulse2`}
      style={{ top: top, left: left }}
      onClick={() => props.hotspotClicked(props.markers.m_id)}
    >
      <div>
        <a
          href="#!"
          aria-label="Click hotspot"
          aria-hidden="true"
          onClick={(e) => e.preventDefault()}
          className="toggle"
        >
          {""}
        </a>
      </div>
    </div>
  );
};

export default Hotspot;
