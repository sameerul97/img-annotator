import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
import { getBase64 } from "../../ImageUtils";

function PopupImageWidget(props) {
  // let isImageFirstWidgetInPopup = props.data.id === props.popupItems[0].id;

  let newImgUrl =
    "https://images.unsplash.com/photo-1509983165097-0c31a863e3f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80";
  const [readMode, setReadMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [highlightedBackground, seHighlightedBackground] = useState(false);
  const [initialImageUrlBackup, setInitialImageUrlBackup] = useState("");
  const [imageUrl, setImageUrl] = useState(false);
  const [imageLocalUrl, setImageLocalUrl] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [thisWidgetId, setThisWidgetId] = useState("");
  const [image_url, setImage_url] = useState(false);

  // image upload
  const onImageChange = (event, newImgLink) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      setImageUrl(event.target.files[0]);
      setImage_url(false);
      setImageLocalUrl(URL.createObjectURL(img));
    }

    if (newImgLink) {
      setImageUrl(event.target.value);
      setImageLocalUrl(event.target.value);
      setImage_url(true);
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
      setImageUrl(props.data.src);
      setImageLocalUrl(props.data.src);
      setThisWidgetId(props.data.id);
      setInitialImageUrlBackup(props.data.src);
    } else {
      setImageUrl(newImgUrl);
      setInitialImageUrlBackup(newImgUrl);
    }

    return () => {};
  }, [props.data.src, props.data.id, newImgUrl, setThisWidgetId]);

  useLayoutEffect(() => {
    let effectActive = true;
    let img = new Image();

    img.src = imageUrl;

    img.onload = function () {
      if (effectActive) {
        if (img.naturalWidth > img.naturalHeight) {
          setIsPortrait(false);
        } else if (img.naturalWidth < img.naturalHeight) {
          setIsPortrait(true);
        } else {
          setIsPortrait(false);
        }
      }
    };
    return () => {
      effectActive = false;
    };
  }, [imageUrl, setImageUrl, props]);

  const popupCancelAndUpdateButtonWrapperStyling = {
    bottom: "6px",
    left: "8px",
    margin: 0,
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
              // props.setPopupWidgetBeingEdited()
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
                setImageUrl(initialImageUrlBackup);
                setImageLocalUrl(initialImageUrlBackup);
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
                props.popupContentChanged(
                  props.data.id,
                  imageUrl,
                  props.data.widget_type_id,
                  image_url
                );
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
              placeholder="image Url"
              aria-label="image Url"
              aria-describedby="addon-wrapping"
              value={imageUrl}
              onChange={(e) => onImageChange(e, true)}
            />
          </div>

          <div className="input-group flex-nowrap input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fas fa-upload"></i>
              </span>
            </div>
            <label className="btn btn-default btn-sm">
              <input
                type="file"
                className="form-control. w-100"
                placeholder="upload image"
                aria-label="upload image"
                aria-describedby="addon-wrapping"
                onChange={(e) => onImageChange(e)}
              />
            </label>
          </div>
        </div>
      )}
      <DeleteButton
        deleteAWidget={props.deleteAWidget}
        widgetId={props.data.id}
        popupEditModeSelected={props.popupEditModeSelected}
      ></DeleteButton>
      {imageUrl && (
        <img
          src={imageLocalUrl}
          alt="empty"
          className="img-fluid"
          style={isPortrait ? { maxWidth: "220px" } : {}}
        />
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
export default PopupImageWidget;
