import React from "react";
import { Provider, useSelector } from "react-redux";

import store from "../store/state/";
import HotspotImageEditor from "../components/Editor/HotspotImage";
import Toast from "../components/Editor/Toast";
import ImageNotFound from "../components/ImageNotFound/";
import { Store } from "../store/state/types";

function Editor(props) {
  // const { image_not_found_error, image_not_found_error_message } = useSelector(
  //   (state) => {
  //     return state.editor;
  //   }
  // );

  // {image_not_found_error && (
  //   <ImageNotFound
  //     image_not_found_error_message={image_not_found_error_message}
  //   />
  // )}
  return (
    <Provider store={store}>
      <HotspotImageContainer>
        <div className="row text-center text-white mr-auto">
          <HotspotImageEditor id={props.match.params} />
        </div>
      </HotspotImageContainer>
    </Provider>
  );
}

export default Editor;

const HotspotImageContainer = ({ children }) => (
  <div className="container-fluid mt-4 ml-0" style={{ width: "95%" }}>
    {children}
  </div>
);

const HotspotWrap = ({ children }) => (
  <div className="points_wrap">{children}</div>
);
