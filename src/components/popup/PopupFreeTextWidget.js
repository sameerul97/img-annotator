import React, { useState, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

function PopupFreeTextWidget(props) {
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });
  const [readMode, setReadMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [highlightedBackground, seHighlightedBackground] = useState(false);
  const [initialFreeTextSrcBackup, setInitialFreeTextSrcBackup] = useState("");

  const onEditorStateChange = (editorState) => {
    setEditorState({
      value: editorState,
    });
  };

  useEffect(() => {
    var defaultText = {
      blocks: [
        {
          key: "7pjmv",
          text: "Free mode",
          type: "header-three",
          depth: 0,
          inlineStyleRanges: [
            { offset: 0, length: 10, style: "" },
            { offset: 0, length: 10, style: "fontsize-.75rem" },
            { offset: 0, length: 10, style: "fontsize-24" },
            { offset: 0, length: 10, style: "fontfamily-Arial" },
            { offset: 0, length: 10, style: "color-rgb(97,189,109)" },
            { offset: 0, length: 10, style: "bgcolor-rgb(247,218,100)" },
          ],
          entityRanges: [{ offset: 0, length: 10, key: 0 }],
          data: { "text-align": "left" },
        },
      ],
      entityMap: {
        0: {
          type: "LINK",
          mutability: "MUTABLE",
          data: { url: "http://google.com", targetOption: "_blank" },
        },
      },
    };

    if (props.data.src !== null) {
      setEditorState({
        value: EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.data.src))
        ),
      });
      setInitialFreeTextSrcBackup(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.data.src))
        )
      );
    } else {
      setEditorState({
        value: EditorState.createWithContent(convertFromRaw(defaultText)),
      });
      setInitialFreeTextSrcBackup(
        EditorState.createWithContent(convertFromRaw(defaultText))
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
                setEditorState({ value: initialFreeTextSrcBackup });
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
                  JSON.stringify(
                    convertToRaw(editorState.value.getCurrentContent())
                  )
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

      <Editor
        readOnly={readMode}
        toolbarHidden={readMode}
        handlePastedText={() => false}
        editorState={editorState.value}
        toolbarClassName="bg-info"
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor-custom"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "history",
          ],
          inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ["bold", "italic", "underline", "strikethrough"],
          },
        }}
      />

      {!readMode && <div className="py-2"></div>}

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
export default PopupFreeTextWidget;
