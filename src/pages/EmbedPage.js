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

  return (
    <React.Fragment>
      {loaded ? (
        <div className="container px-0 text-center imageMarker">
          <img
            ref={imageRef}
            onLoad={onLoad}
            src={image.url}
            alt={image.url}
            className="target rounded img-fluid w-100 shadow"
          />
          {imageLoaded && (
            <HotspotWrap>
              {image.marker_positions.map((image_position, index) => (
                <React.Fragment key={index}>
                  <Hotspot
                    ref={(el) => (itemsRef.current[index] = el)}
                    key={index}
                    markers={image_position}
                    width={imageWidth / naturalImageWidth}
                  />
                </React.Fragment>
              ))}
            </HotspotWrap>
          )}
        </div>
      ) : (
        <p>Loading</p>
      )}
    </React.Fragment>
  );
}

export default EmbedPage;

const HotspotWrap = ({ children }) => (
  <div className="points_wrap">{children}</div>
);
