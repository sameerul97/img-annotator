import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw } from "draft-js";

import Spacer from "../Spacer";
import { WidgetSrc } from "../interfaces";

function PopupTextWidget({ src }: WidgetSrc) {
  const [headerSrc, setHeaderSrc] = useState({
    value: EditorState.createEmpty()
  });

  useEffect(() => {
    setHeaderSrc({
      value: EditorState.createWithContent(convertFromRaw(JSON.parse(src)))
    });
  }, [src]);

  if (!headerSrc) {
    return null;
  }

  return (
    <Spacer>
      <Editor
        readOnly={true}
        toolbarHidden={true}
        handlePastedText={() => false}
        editorState={headerSrc.value}
        toolbarClassName="bg-info"
        wrapperClassName="demo-wrapper headerWrapper"
        editorClassName="demo-editor-custom"
      />
    </Spacer>
  );
}

export default PopupTextWidget;
