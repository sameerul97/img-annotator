import React from "react";

function PopupVideoWidget({ src }) {
  return (
    <div className="video_wrapper_on_drag position-relative">
      <div className="embed-container">
        <iframe
          width="560"
          height="315"
          className="border-0"
          src={src}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          title="video_"
        />
      </div>
    </div>
  );
}

export default PopupVideoWidget;
