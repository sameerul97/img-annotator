import React, { useState, useEffect } from "react";

const Hotspot = React.forwardRef((props, ref) => {
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
      data-top={props.markers.top}
      id={props.markers.m_id}
      style={{ top: top, left: left }}
      data-left={props.markers.left}
      data-key={props.markers.m_id}
      key={props.markers.m_id}
      // data-popupid={`#popup` + props.image_position.popup_id}
      data-popupid={`#popup` + props.markers.popup_id}
    >
      <div>
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="toggle"
        >
        </a>
      </div>
    </div>
  );
});

export default Hotspot;
