import React, { useState, useEffect } from "react";
import { CirclePicker } from "react-color";

function ColorPicker(props) {
  const [showColorPanel, setShowColorPanel] = useState(false);

  const [color, setColor] = useState();

  useEffect(() => {
    if (!props.selectedMarker) {
      setShowColorPanel(false);
    } else {
      setTimeout(() => setShowColorPanel(true), 400);
    }
  }, [showColorPanel, props.selectedMarker]);

  const handleChangeComplete = (color) => {
    setColor(color);
    props.onColorSelected(color);
  };

  return (
    <>
      {showColorPanel && !props.popupViewEnabled ? (
        <div className="smoothTransition py-2 ">
          <CirclePicker
            color={color}
            disableAlpha={true}
            colors={[
              "#f44336",
              "#ffffff",
              "#e91e63",
              "#9c27b0",
              "#3f51b5",
              "#2196f3",
              "#03a9f4",
              "#00bcd4",
              "#009688",
              "#673ab7",
            ]}
            circleSpacing={6}
            width="90%"
            onChange={handleChangeComplete}
          />
        </div>
      ) : undefined}
    </>
  );
}

export default ColorPicker;
