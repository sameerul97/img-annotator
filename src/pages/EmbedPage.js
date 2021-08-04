import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Marker.css";

import useGetImageNaturalData from "../hooks/useGetImageNaturalData";
import useFetchImage from "../hooks/useFetchImage";

import Text from "../components/Embed/Text";
import Popup from "../components/Embed/Popup";
import Hotspot from "../components/Embed/Hotspot";

function EmbedPage(props) {
  const { id } = useParams();

  const [popupState, setPopupState] = useState({ open: false });
  const [selectedMarker, setSelectedMarker] = useState();
  const [selectedPopup, setSelectedPopup] = useState();

  // custom hooks
  const [
    imageRef,
    imageLoaded,
    onLoad,
    naturalImageHeight,
    naturalImageWidth,
    imageWidth,
    imageHeight
  ] = useGetImageNaturalData();
  const { status, image, markers, popup_data, error } = useFetchImage(id);

  useEffect(() => {
    props.setIsEmbedPage(true);
  }, []);

  useEffect(() => {
    if (selectedMarker) {
      setSelectedPopup(popup_data.find(i => i.id === selectedMarker.m_id).popup_content.find(j => j.widget_type_id === "widget_id_3").src);
    }
  }, [selectedMarker, popup_data]);

  function hotspotClicked(id) {
    setSelectedPopup("");
    setSelectedMarker(markers.find(i => i.m_id === id))
  };

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
      {selectedPopup &&
        <Popup
          widgets={selectedPopup}
          markers={selectedMarker}
          width={imageWidth  }
          naturalImageWidth={naturalImageWidth}
        />
      }
    </React.Fragment>
  );

  return (
    <EmbedPageContainer>
      {status === 'idle' && <EmbedLoading />}
      {status === 'error' && <div>{error}</div>}
      {status === 'fetching' && <EmbedLoading />}
      {status === 'fetched' && (
        <React.Fragment>
          {EmbedImage}
          <HotspotWrap>
            {Hotspots}
          </HotspotWrap>
          {PopupContainer}
        </React.Fragment>
      )}
    </EmbedPageContainer>
  )
}

export default EmbedPage;

const HotspotWrap = ({ children }) => (
  <div className="points_wrap">{children}</div>
);

const EmbedPageContainer = ({ children }) => (
  <div className="container px-0 text-center imageMarker mt-0 position-relative">
    {children}
  </div>
);

const EmbedLoading = () => (
  <div
    className="text-center w-100 d-flex shine"
    style={{ minHeight: "780px" }}
  />
);
