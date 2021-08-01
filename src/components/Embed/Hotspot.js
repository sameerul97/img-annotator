import React, { useState, useEffect } from "react";

const Hotspot = (props) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    setTop(
      isNaN(props.markers.top * props.width)
        ? 0
        : parseFloat(props.markers.top * props.width)
    );

    setLeft(
      isNaN(props.markers.left * props.width)
        ? 0
        : parseFloat(props.markers.left * props.width)
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
          onClick={(e) => e.preventDefault()}
          className="toggle"
        >
        </a>
      </div>
    </div>
  );
};

export default Hotspot;
