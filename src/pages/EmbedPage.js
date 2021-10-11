import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "../css/Marker.css";
import { ActionType } from "../store/Embed/action-types";
import { EmbedContext } from "../store/Embed";

import useGetImageNaturalData from "../hooks/useGetImageNaturalData.ts";
import useFetchImage from "../hooks/useFetchImage.ts";
import useScript from "../hooks/useScript";

import Popup from "../components/Embed/Popup.tsx";
import Hotspot from "../components/Embed/Hotspot.tsx";

function EmbedPage(props) {
  const { id } = useParams();
  const { state, dispatch } = useContext(EmbedContext);

  const [selectedMarker, setSelectedMarker] = useState();

  // custom hook
  const [
    imageRef,
    imageLoaded,
    onLoad,
    naturalImageHeight,
    naturalImageWidth,
    imageWidth,
    imageHeight,
  ] = useGetImageNaturalData();

  const { status, image, markers, popup_data, error, details } =
    useFetchImage(id);

  // if (status === "fetched") {
  // useScript(
  //   "https://xd.wayin.com/embed/e8ddc6fa-abc5-4af6-a796-540a61c17cb1?mode=responsive",
  //   "#embedContainer",
  //   true
  // );

  useEffect(() => {
    // var script =
    //   '<script src="https://xd.wayin.com/embed/76b00206-1266-4e09-8050-6efd71db8444?mode=responsive"></script>';

    window.postscribe("#embedContainer", details.script);
  }, [details.script]);

  useEffect(() => props.setIsEmbedPage(true), [props]);

  function hotspotClicked(id) {
    if (id === state.selectedMarker) return;

    dispatch({ type: ActionType.SET_LOADING });
    setSelectedMarker(markers.find((i) => i.m_id === id));

    dispatch({
      type: ActionType.SET_SELECTED_POPUP,
      payload: {
        popup: popup_data.find((i) => i.id === id).popup_content,
        selectedMarker: markers.find((i) => i.m_id === id),
      },
    });
  }

  const EmbedImage = (
    <React.Fragment>
      {!imageLoaded && <EmbedLoading />}
      <img
        ref={imageRef}
        onLoad={onLoad}
        src={image.url}
        alt={image.url}
        className="target rounded img-fluid w-100 shadow"
      />
    </React.Fragment>
  );

  const Hotspots = (
    <React.Fragment>
      {imageLoaded && (
        <React.Fragment>
          {markers.map((image_position, index) => (
            <Hotspot
              key={index}
              markers={image_position}
              width={imageWidth / naturalImageWidth}
              hotspotClicked={hotspotClicked}
            />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const PopupContainer = (
    <React.Fragment>
      {state.popup.length > 0 && (
        <Popup
          markers={selectedMarker}
          width={imageWidth}
          naturalImageWidth={naturalImageWidth}
        />
      )}
    </React.Fragment>
  );

  const PageDetails = (
    <React.Fragment>
      <div className="container text-left my-3 pl-md-0">
        <div className="col-md-10 pl-md-0">
          <h2 style={{"fontWeight": "300"}}>{details.header}</h2>
          <p className="my-2" style={{"fontWeight": "200"}}>{details.copy}</p>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {status === "fetched" && PageDetails}
      <EmbedPageContainer>
        {status === "idle" && <EmbedLoading />}
        {status === "error" && <div>{error}</div>}
        {status === "fetching" && <EmbedLoading />}
        {status === "fetched" && (
          <React.Fragment>
            {EmbedImage}
            <HotspotWrap>{Hotspots}</HotspotWrap>
            {PopupContainer}
          </React.Fragment>
        )}
      </EmbedPageContainer>
      <EmbedFormContainer />
    </React.Fragment>
  );
}

export default EmbedPage;

const EmbedFormContainer = ({ children }) => (
  <div className="container bg-dark my-5" id="embedContainer">
    {children}
  </div>
);

const HotspotWrap = ({ children }) => (
  <div className="points_wrap">{children}</div>
);

const EmbedPageContainer = ({ children }) => (
  <div className="container embed-spacer px-0 text-center imageMarker position-relative">
    {children}
  </div>
);

const EmbedLoading = () => (
  <div
    className="text-center w-100 d-flex shine"
    style={{ minHeight: "780px" }}
  />
);
