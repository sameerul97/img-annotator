import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
import { getBase64 } from "../ImageUtils";

function PopupVideoWidget(props) {
  let newImgUrl = "https://www.youtube.com/embed/lvfB_p0IiHM";
  const [readMode, setReadMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [highlightedBackground, seHighlightedBackground] = useState(false);
  const [initialVideoUrlBackup, setInitialVideoUrlBackup] = useState("");
  const [videoUrl, setVideoUrl] = useState(false);

  const onVideoUrlChange = (event) => {
    let newUrl = event.target.value;
    let videoHost = newUrl.split("/")[2];

    // Create a endpoint in API to validate each video link
    if (videoHost === "vimeo.com") {
      setVideoUrl("https://player.vimeo.com/video/" + newUrl.split("/")[3]);
    } else if (videoHost === "www.youtube.com") {
      setVideoUrl("https://www.youtube.com/embed/" + newUrl.split("?v=")[1]);
    } else {
      setVideoUrl(event.target.value);
    }
  };

  useEffect(() => {
    window.$(function () {
      window.$("body").tooltip({
        selector: '[data-toggle="tooltip"]',
        delay: { show: 0, hide: 100 },
        trigger: "hover",
        animation: true,
      });
    });

    return () => {
      window.$("div[role=tooltip]").remove();
    };
  }, []);

  useLayoutEffect(() => {
    if (props.data.src !== null) {
      setVideoUrl(props.data.src);
      setInitialVideoUrlBackup(props.data.src);
    } else {
      setVideoUrl(newImgUrl);
      setInitialVideoUrlBackup(newImgUrl);
    }

    return () => {};
  }, [props.data.src, props.data.id, newImgUrl]);

  const popupCancelAndUpdateButtonWrapperStyling = {
    bottom: "6px",
    left: "8px",
    margin: 0,
    zIndex: 1,
  };

  return (
    <div
      className={`smoothTransition text-dark whiteBackground position-relative  ${
        props.popupEditModeSelected ? "position-relative " : " py-1null "
      } ${!readMode ? " popupEditingWidget px-1 highlightedBackground " : null}
          ${highlightedBackground ? " highlightedBackground " : null}`}
      onMouseEnter={(e) => {
        if (!props.popupEditModeSelected) {
          setShowEditButton(true);
          seHighlightedBackground(true);
        }
      }}
      onMouseLeave={(e) => {
        if (!props.popupEditModeSelected) {
          setShowEditButton(false);
          seHighlightedBackground(false);
        }
      }}
    >
      {readMode && showEditButton ? (
        <motion.div
          initial={{ opacity: 0.1, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="position-absolute popupWidget_EditButton"
        >
          <a
            href="#!"
            className="badge badge-info text-white px-0 border rounded position-absolute popupWidget_EditButton"
            id={props.widgetId}
            onClick={(e) => {
              e.preventDefault();
              setReadMode(false);
              props.setPopupWidgetBeingEdited((prevState) => {
                return [...prevState, { id: props.data.id }];
              });
            }}
            aria-disabled="true"
          >
            <i className="text-white px-2 far fa-edit fa-1x"> </i>
          </a>
        </motion.div>
      ) : undefined}
      {!readMode && (
        <div
          className="row position-absolute"
          style={popupCancelAndUpdateButtonWrapperStyling}
        >
          <div className="col pl-0 pr-2 no-gutters">
            <a
              href="#!"
              className="badge badge-danger text-white  border-0 rounded popupWidget_ExitButton"
              data-toggle="tooltip"
              data-placement="left"
              title="Cancel changes"
              onClick={(e) => {
                e.preventDefault();
                window.$("div[role=tooltip]").remove();
                setReadMode(true);
                setVideoUrl(initialVideoUrlBackup);
                setShowEditButton(false);
                props.setPopupWidgetBeingEdited((prevState) => {
                  return prevState.filter(
                    (marker) => marker.id !== props.data.id
                  );
                });
              }}
              role="button"
              aria-disabled="true"
            >
              <i className="text-white m-auto far fa-times-circle fa-1x"> </i>
            </a>
          </div>
          <div className="col pl-0  no-gutters">
            <a
              href="#!"
              className="badge badge-success text-white  border-0 rounded popupWidget_ExitButton"
              data-toggle="tooltip"
              data-placement="right"
              title="Save changes"
              onClick={(e) => {
                e.preventDefault();
                window.$("div[role=tooltip]").remove();
                props.popupContentChanged(props.data.id, videoUrl);
                setReadMode(true);
                setShowEditButton(false);
                props.setPopupWidgetBeingEdited((prevState) => {
                  return prevState.filter(
                    (marker) => marker.id !== props.data.id
                  );
                });
              }}
              role="button"
              aria-disabled="true"
            >
              <i className="text-white m-auto far fa-check-circle fa-1x"> </i>
            </a>
          </div>
        </div>
      )}
      {!readMode && (
        <div>
          <div className="input-group flex-nowrap input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fas fa-link"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="video Url"
              aria-label="video Url"
              aria-describedby="addon-wrapping"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e)}
            />
          </div>
        </div>
      )}
      <DeleteButton
        deleteAWidget={props.deleteAWidget}
        widgetId={props.data.id}
        popupEditModeSelected={props.popupEditModeSelected}
      ></DeleteButton>
      {setVideoUrl && (
        <div
          className="video_wrapper_on_drag"
          style={
            props.popupEditModeSelected
              ? { position: "relative", zIndex: 1 }
              : {}
          }
        >
          <div className="embed-container">
            <iframe
              width="560"
              height="315"
              className="border-0"
              src={videoUrl.toString()}
              style={props.popupEditModeSelected ? { zIndex: -1 } : {}}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              title="video_"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
const DeleteButton = (props) => (
  <React.Fragment>
    {props.popupEditModeSelected && (
      <button
        className="btn-sm btn btn-danger text-white px-0  rounded popupWidget_DeleteButton"
        id={props.widgetId}
        onClick={(e) => props.deleteAWidget(e)}
      >
        <i className="text-white px-2 far fa-trash-alt fa-1x"> </i>
      </button>
    )}
  </React.Fragment>
);
export default PopupVideoWidget;
