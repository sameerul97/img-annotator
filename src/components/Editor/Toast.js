import React from "react";
import { useSelector } from "react-redux";

import $ from "jquery";

function Toast() {
  window.$(".toast").toast();
  const { toast } = useSelector((state) => {
    return state.editor;
  });

  if (!toast) {
    return <React.Fragment />;
  }

  return (
    <div aria-live="polite" aria-atomic="true" style={{ position: "relative" }}>
      <div
        className="toast"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          opacity: 1,
          zIndex: 1000,
        }}
      >
        <div className="toast-header bg-info text-white">
          <span role="img" aria-label="Alert" height="100">
            😮 😮 😮
          </span>
          <strong className="mr-auto"></strong>
        </div>
        <div
          className="toast-body text-dark"
          style={{ backgroundColor: "#88888859" }}
        >
          Close already opened popup{" "}
          <span role="img" aria-label="Alert" height="100">
            😎
          </span>
        </div>
      </div>
    </div>
  );
}

export default Toast;
