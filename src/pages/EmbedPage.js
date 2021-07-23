import React, { useState, useEffect, useCallback, useRef } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import "../Marker.css";
import Hotspot from "../components/Embed/Hotspot";
import { ParseData } from "../utils/ParseImageData";
import useGetImageNaturalData from "../hooks/useGetImageNaturalData";

function EmbedPage(props) {
  const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState({});
  const itemsRef = useRef([]);

  const { id } = useParams();

  const fetchImage = useCallback(async () => {
    try {
      const res = await await API.get(`/image/`, {
        params: {
          image_id: parseInt(id)
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });

      const [fetchedImage, popupContent] = ParseData(res.data);

      // setPopups(popupContent);
      setImage(fetchedImage);
      setLoaded(true);
    } catch (error) {
      let errorResponse = error.response;

      if (errorResponse.data.message === "Expired token") {
        props.history.push(`/login/`);
      }

      if (errorResponse.status === 404) {
        // setImageNotFoundError(true);
        // setImageNotFoundErrorMessage(errorResponse.data.message);
      }
    }

    return;
  }, []);

  useEffect(() => {
    props.setIsEmbedPage(true);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchImage();
    })();
  }, [fetchImage]);

  const [
    imageRef,
    imageLoaded,
    onLoad,
    naturalImageHeight,
    naturalImageWidth,
    imageWidth,
    imageHeight
  ] = useGetImageNaturalData();

  let EmbedImage = <EmbedLoading />;

  if (loaded) {
    EmbedImage = (
      <React.Fragment>
        <img
          ref={imageRef}
          onLoad={onLoad}
          src={image.url}
          alt={image.url}
          className="target rounded img-fluid w-100 shadow"
        />
        {!imageLoaded && <EmbedLoading />}
      </React.Fragment>
    );
  }

  const Hotspots = (
    <React.Fragment>
      {imageLoaded && (
        <HotspotWrap>
          {image.marker_positions.map((image_position, index) => (
            <Hotspot
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              markers={image_position}
              width={imageWidth / naturalImageWidth}
            />
          ))}
        </HotspotWrap>
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <EmbedPageContainer>
        {EmbedImage}
        {Hotspots}
      </EmbedPageContainer>
    </React.Fragment>
  );
}

export default EmbedPage;

const HotspotWrap = ({ children }) => (
  <div className="points_wrap">{children}</div>
);

const EmbedPageContainer = ({ children }) => (
  <div className="container px-0 text-center imageMarker">{children}</div>
);

const EmbedLoading = () => (
  <div
    className="text-center w-100 d-flex shine"
    style={{ minHeight: "780px" }}
  />
);
