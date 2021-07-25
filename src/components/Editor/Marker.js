import React, { useState, useEffect } from "react";

import "../../Marker.css";

const Markers = React.forwardRef((props, ref) => {
  const [showBorder, setShowBorder] = useState(false);
  const [thisMarkerId, setThisMarkerid] = useState(false);

  useEffect(() => {
    if (!props.selectedMarker) {
      setShowBorder(false);
    }

    if (thisMarkerId !== parseInt(props.selectedMarker.markerId)) {
      setShowBorder(false);
    }

    setThisMarkerid(props.markers.m_id);
  }, [
    thisMarkerId,
    setShowBorder,
    props.markers.m_id,
    props.selectedMarker.markerId,
    props.selectedMarker,
  ]);

  const markerInLineStyle = {
    background: props.markers.color,
  };

  return (
    <>
      <div
        ref={ref}
        data-key={props.markers.m_id}
        key={props.markers.m_id}
        id={props.markers.m_id}
        className={`item-point circle ${
          props.popupViewEnabled ? "pulse2" : ""
        } ${!props.popupViewEnabled && showBorder ? "showBorder" : ""}`}
        style={markerInLineStyle}
        data-top={props.markers.top}
        data-left={props.markers.left}
        data-popupid={`#popup` + props.markers.popup_id}
        onClick={
          props.popupViewEnabled
            ? (e) => {
                if (
                  !props.popupModeMarkerSelected ||
                  // Checking if user clicking the already opened popup marker
                  props.popupModeMarkerSelected.popupId ===
                    props.markers.popup_id
                ) {
                  props.setPopupModeMarkerSelected({
                    markerId: thisMarkerId,
                    popupId: props.markers.popup_id,
                  });
                } else {
                  props.setShowToast(true);
                  setTimeout(() => props.setShowToast(false), 4500);
                }
              }
            : (e) => {
                props.setSelectedMarker({
                  markerId: thisMarkerId,
                  popupId: props.markers.popup_id,
                });
                setShowBorder(true);
              }
        }
      >
        {props.popupViewEnabled && (
          <div>
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="toggle"
            >
              {" "}
            </a>
          </div>
        )}
      </div>
    </>
  );
});

export default Markers;
