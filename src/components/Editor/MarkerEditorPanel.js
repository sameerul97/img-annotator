import React, { useState, useRef } from "react";
import { HashRouter, Link } from "react-router-dom";

import "../../Marker.css";
import { APP_DOMAIN } from "../../helper";

const iconBgStyle = {
  background: "#2a85a5",
  padding: "10px",
  borderRadius: "20px"
};

function MarkerEditorPanel(props) {
  return (
    <>
      <div className="row text-left  mx-0 ">
        <div className="col-5  order-12 order-md-1  px-0 text-white">
          <div className="p-1 ">
            <a
              className={`smoothTransition btn btn-sm ${
                !props.popupViewEnabled ? "" : "disabled"
              }`}
              href="#!"
              data-toggle="tooltip"
              data-placement="top"
              title="Add Marker"
              onClick={(e) => {
                // console.log("Add");
                e.preventDefault();
                props.addNewMarker();
              }}
            >
              <i
                className="text-white fas fa-plus-circle fa-1x"
                style={iconBgStyle}
              ></i>
            </a>

            <a
              href="#!"
              className={`smoothTransition btn btn-sm ${
                props.selectedMarker && !props.popupViewEnabled
                  ? ""
                  : "disabled"
              }`}
              ref={props.deleteRef}
              data-toggle="tooltip"
              data-placement="top"
              title="Delete Marker"
              onClick={(e) => {
                e.preventDefault();
                props.deleteMarker();
              }}
              role="button"
              aria-disabled="true"
            >
              <i
                className=" text-white far fa-trash-alt fa-1x"
                style={iconBgStyle}
              ></i>
            </a>
            <CopyEmbedCodeButton imageId={props.imageId} />
          </div>
        </div>

        <div className="smoothTransition col-7 order-1 order-md-1  px-0 py-2 py-md-0 my-auto text-md-right text-left">
          <PreviewButton imageId={props.imageId} />
          <Buttons
            enablePopupView={props.enablePopupView}
            enableDraggableMode={props.enableDraggableMode}
            popupEditMode={props.popupEditMode}
          />
        </div>
      </div>
    </>
  );
}

const CopyEmbedCodeButton = ({ imageId }) => {
  const toolTipRef = useRef(null);
  const [toolTipState, setToolTipState] = useState("Copy embed code");

  function copyEmbedCodeIntoClipBoard(e) {
    e.preventDefault();

    window
      .$("#embedCodeButton")
      .attr("data-original-title", "Copied to clipboard!")
      .tooltip("show");

    setTimeout(() => {
      window
        .$("#embedCodeButton")
        .attr("data-original-title", "Copy embed code")
        .tooltip("show");
    }, 2500);
    navigator.clipboard.writeText(`${APP_DOMAIN}/embed/${imageId}`);
  }

  return (
    <button
      className="smoothTransition btn btn-sm shadow-none"
      data-toggle="tooltip"
      data-placement="top"
      title={toolTipState}
      onClick={copyEmbedCodeIntoClipBoard}
      aria-disabled="true"
      data-tooltipdata={toolTipState}
      ref={toolTipRef}
      id="embedCodeButton"
    >
      <i className="text-white far fa-copy fa-1x" style={iconBgStyle}></i>
    </button>
  );
};

const PreviewButton = ({ imageId }) => {
  return (
    <HashRouter>
      <Link to={`/embed/${imageId}`} target="_blank" rel="noopener noreferrer">
        <button className="btn btn-info mx-2">Preview</button>
      </Link>
    </HashRouter>
  );
};

const Buttons = (props) => {
  const [currentlySelectedButton, setCurrentylSelectedButton] =
    useState("Marker");
  const [MARKER_BUTTON_NAME, POPUP_BUTTON_NAME] = ["Marker", "Popup"];

  return (
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      <label
        className={`smoothTransition btn btn-info ${
          currentlySelectedButton === MARKER_BUTTON_NAME ? "active" : ""
        } ${!props.popupEditMode ? "" : "disabled"}`}
      >
        <input
          type="radio"
          name="options"
          id="option1"
          onClick={() => {
            props.enableDraggableMode();
            setCurrentylSelectedButton(MARKER_BUTTON_NAME);
          }}
          defaultChecked
        />{" "}
        Marker
      </label>

      <label
        className={`smoothTransition btn btn-info ${
          currentlySelectedButton === POPUP_BUTTON_NAME ? "active" : ""
        } ${!props.popupEditMode ? "" : "disabled"}`}
      >
        <input
          type="radio"
          name="options"
          onClick={() => {
            props.enablePopupView();
            setCurrentylSelectedButton(POPUP_BUTTON_NAME);
          }}
        />
        Popup
      </label>
    </div>
  );
};

const LinkButton = {};

export default MarkerEditorPanel;
