import React from "react";

function PlusButton() {
  let createNewImage = { position: "absolute", bottom: 0, right: 0 };

  return (
    <div>
      <div style={createNewImage}>
        <i className="text-primary fas fa-plus-circle fa-3x m-2"></i>
      </div>
    </div>
  );
}

export default PlusButton;
