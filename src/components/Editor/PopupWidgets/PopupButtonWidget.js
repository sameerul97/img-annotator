import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

function PopupButtonWidget(props) {
  const [readMode, setReadMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [highlightedBackground, seHighlightedBackground] = useState(false);
  const [buttonUrlLink, setButtonUrlLink] = useState("https:google.com");
  const [initialButtonUrlBackup, setInitialButtonUrlBackup] = useState("");
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });
  const [initialEditorState, setInitialEditorState] = useState("");

  const onEditorStateChange = (editorState) => {
    setEditorState({
      value: editorState,
    });
  };

  const urlInputChange = (e) => {
    setButtonUrlLink(e.target.value);
  };

  useEffect(() => {
    let newButtonText = {
      blocks: [
        {
          key: "7pjmv",
          text: "Some test button",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: { "text-align": "center" },
        },
      ],
      entityMap: {},
    };
    if (props.data.src !== null) {
      var button = JSON.parse(props.data.src);
      setButtonUrlLink(button.buttonUrlSrc);
      setInitialButtonUrlBackup(button.buttonUrlSrc);

      setEditorState({
        value: EditorState.createWithContent(
          convertFromRaw(button.buttonTextSrc)
        ),
      });
      setInitialEditorState(
        EditorState.createWithContent(convertFromRaw(button.buttonTextSrc))
      );
    } else {
      setInitialButtonUrlBackup("https://google.com");
      setEditorState({
        value: EditorState.createWithContent(convertFromRaw(newButtonText)),
      });
      setInitialEditorState(
        EditorState.createWithContent(convertFromRaw(newButtonText))
      );
    }

    return () => {
      // cleanup
    };
  }, [props]);

  const popupCancelAndUpdateButtonWrapperStyling = {
    bottom: "6px",
    left: "8px",
    margin: 0,
    zIndex: 11,
  };

  return (
    <div
      className={`smoothTransition text-dark whiteBackground position-relative  ${
        props.popupEditModeSelected ? "position-relative " : " py-1null "
      } ${
        !readMode ? " popupEditingWidget px-1 highlightedBackground " : " px-2"
      }
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

                setEditorState({ value: initialEditorState });

                setButtonUrlLink(initialButtonUrlBackup);
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
                  JSON.stringify({
                    buttonTextSrc: convertToRaw(
                      editorState.value.getCurrentContent()
                    ),
                    buttonUrlSrc: buttonUrlLink,
                  }),
                  props.data.widget_type_id
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
        <div className="input-group flex-nowrap input-group-sm">
          <div className="input-group-prepend">
            <span className="input-group-text" id="addon-wrapping">
              <i className="fas fa-link"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Button Url"
            aria-label="Button Url"
            aria-describedby="addon-wrapping"
            value={buttonUrlLink}
            onChange={(e) => urlInputChange(e)}
          />
        </div>
      )}
      <div
        className="video_wrapper_on_drag"
        style={
          props.popupEditModeSelected ? { position: "relative", zIndex: 1 } : {}
        }
      >
        <a
          {...(readMode ? { href: buttonUrlLink, target: "_blank" } : {})}
          className={`btn buttonWidgetWrapper w-100 rounded-0
          ${!readMode ? " text-dark bg-white" : " btn-info"}`}
          style={
            props.popupEditModeSelected
              ? { position: "relative", zIndex: -1 }
              : {}
          }
        >
          <Editor
            readOnly={readMode}
            toolbarHidden={readMode}
            handlePastedText={() => false}
            editorState={editorState.value}
            toolbarClassName="bg-info m-0 p-0 border-0"
            wrapperClassName="demo-wrapper m-0 p-0 border-0"
            editorClassName={`demo-editor-custom m-0 p-0 border-0 buttonEditor   ${
              !readMode ? "changeCursor " : " "
            }  `}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [],
            }}
          />
        </a>
      </div>
      <DeleteButton
        deleteAWidget={props.deleteAWidget}
        widgetId={props.data.id}
        popupEditModeSelected={props.popupEditModeSelected}
      ></DeleteButton>
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
export default PopupButtonWidget;
