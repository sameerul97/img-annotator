import React, { useContext } from "react";

import { EmbedContext } from "../../store/Embed";
import { ActionType } from "../../store/Embed/action-types";

const PopupClose = () => {
  const { dispatch } = useContext(EmbedContext);

  const close = () => dispatch({ type: ActionType.CLOSE_SELECTED_POPUP });

  return (
    <div className="pointBoxClose exit" onClick={close}>
      <div className="pointBoxCloseIcon">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="black" strokeWidth="1">
            <path d="M2 14L14 2M2 2l12 12"></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PopupClose;
