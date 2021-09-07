import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useParams } from "react-router-dom";

import "../Marker.css";

import API from "../api";
import useGetImageNaturalData from "../hooks/useGetImageNaturalData";
import { ParseData } from "../utils/ParseImageData";

import Hotspot from "../components/Embed/Hotspot";
import Text from "../components/Embed/Text";
import Popup from "../components/Embed/Popup";

// type EmbedPageProps = {};
type EmbedPageProps = {
  optional?: any;
  history: RouteComponentProps["history"];
  setIsEmbedPage: Dispatch<SetStateAction<boolean>>;
};

interface ParamTypes {
  id: string;
}

function EmbedPageT(props: EmbedPageProps) {
  const id: number = parseInt(useParams<ParamTypes>().id);
  console.log(id);
  // const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState({});
  // const [markers, setMarkers] = useState([]);
  // const [popups, setPopups] = useState([]);
  // const [popupState, setPopupState] = React.useState({ open: false });
  // const [selectedMarker, setSelectedMarker] = useState();
  // const [selectedPopup, setSelectedPopup] = useState();

  // function hotspotClicked(id) {
  //   setSelectedPopup("");
  //   setSelectedMarker(markers.find((i) => i.m_id === id));
  // }

  useEffect(() => {
    props.setIsEmbedPage(true);
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await API.get(`/image/index.php`, {
          params: {
            image_id: id,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        let fetchedImage;
        let popupContent;
         [fetchedImage, popupContent] = ParseData(res.data);
        console.log(fetchedImage);

        setImage(fetchedImage);
        // setMarkers(fetchedImage.marker_positions);
        // setPopups(popupContent);

        // setLoaded(true);
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
    };

    fetchImage();
  }, [id, props.history]);

  // useEffect(() => {
  //   if (selectedMarker) {
  //     setSelectedPopup(
  //       popups
  //         .find((i) => i.id === selectedMarker.m_id)
  //         .popup_content.find((j) => j.widget_type_id === "widget_id_3").src
  //     );
  //   }
  // }, [selectedMarker, popups]);

  // const [
  //   imageRef,
  //   imageLoaded,
  //   onLoad,
  //   naturalImageHeight,
  //   naturalImageWidth,
  //   imageWidth,
  //   imageHeight,
  // ] = useGetImageNaturalData();

  // let EmbedImage = <EmbedLoading />;

  // if (loaded) {
  //   EmbedImage = (
  //     <React.Fragment>
  //       {!imageLoaded && <EmbedLoading />}
  //       <img
  //         ref={imageRef}
  //         onLoad={onLoad}
  //         src={image.url}
  //         alt={image.url}
  //         className="target rounded img-fluid w-100 shadow"
  //       />
  //       <Text message={"Test"} id={10} />
  //     </React.Fragment>
  //   );
  // }

  // const Hotspots = (
  //   <React.Fragment>
  //     {imageLoaded && (
  //       <React.Fragment>
  //         {markers.map((image_position, index) => (
  //           <Hotspot
  //             key={index}
  //             markers={image_position}
  //             width={imageWidth / naturalImageWidth}
  //             hotspotClicked={hotspotClicked}
  //           />
  //         ))}
  //       </React.Fragment>
  //     )}
  //   </React.Fragment>
  // );

  // const Popups = (
  //   <React.Fragment>
  //     {selectedPopup && (
  //       <Popup
  //         widgets={selectedPopup}
  //         markers={selectedMarker}
  //         width={imageWidth / naturalImageWidth}
  //       />
  //     )}
  //   </React.Fragment>
  // );

  return (
    <React.Fragment>
      <div>
        <img
          // ref={imageRef}
          // onLoad={onLoad}
          src={
            "http://localhost/api/user_images/161132036832photo-1579126898112-0ea5054a86f6.jpeg"
          }
          alt={
            "http://localhost/api/user_images/161132036832photo-1579126898112-0ea5054a86f6.jpeg"
          }
          className="target rounded img-fluid w-100 shadow"
        />
      </div>
      {/* <EmbedPageContainer>
        {EmbedImage}
        <HotspotWrap>
          {Hotspots}
          {Popups}
        </HotspotWrap>
      </EmbedPageContainer> */}
    </React.Fragment>
  );
}

export default EmbedPageT;

// const HotspotWrap = ({ children }) => (
//   <div className="points_wrap">{children}</div>
// );

// const EmbedPageContainer = ({ children }) => (
//   <div className="container px-0 text-center imageMarker mt-0 position-relative">
//     {children}
//   </div>
// );

// const EmbedLoading = () => (
//   <div
//     className="text-center w-100 d-flex shine"
//     style={{ minHeight: "780px" }}
//   />
// );
