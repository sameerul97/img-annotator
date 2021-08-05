import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";

import Spacer from "../Spacer";

function PopupButtonWidget({ src }) {
  const [buttonUrlLink, setButtonUrlLink] = useState();
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });

  useEffect(() => {
    if (src !== null) {
      let button = JSON.parse(src);

      setButtonUrlLink(button.buttonUrlSrc);

      setEditorState({
        value: EditorState.createWithContent(
          convertFromRaw(button.buttonTextSrc)
        ),
      });
    }
  }, [src]);

  if (!buttonUrlLink) {
    return null;
  }

  return (
    <Spacer>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={`btn buttonWidgetWrapper w-100 rounded-0 btn-info`}
        href={buttonUrlLink}
      >
        <Editor
          readOnly={true}
          toolbarHidden={true}
          handlePastedText={() => false}
          editorState={editorState.value}
          toolbarClassName="bg-info m-0 p-0 border-0"
          wrapperClassName="demo-wrapper m-0 p-0 border-0"
          editorClassName={`demo-editor-custom m-0 p-0 border-0 buttonEditor  `}
        />
      </a>
    </Spacer>
  );
}

export default PopupButtonWidget;
