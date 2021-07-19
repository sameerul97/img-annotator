import React, { useState, useEffect, useCallback, useRef } from 'react'
import API from "../api";
import { Widgets, Widget_ID } from "../components/Widgets";
import { useParams } from "react-router-dom";
import "../Marker.css";
import Marker from "../lib/Marker";

function EmbedPage(props) {
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState({});
    const itemsRef = useRef([]);

    const { id } = useParams();

    const fetchImage = useCallback(async () => {
        try {
            var imageData = await await API.get(`/image/`, {
                params: {
                    image_id: parseInt(id),
                },
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            imageData = imageData.data;

            var fetchedImage = {},
                popupContent = [];

            fetchedImage["url"] = imageData[0]["url"];
            fetchedImage["name"] = imageData[0]["name"];
            fetchedImage["id"] = imageData[0]["Image_Id"];
            fetchedImage["marker_positions"] = [];

            var temp_markers = [];
            for (var i in imageData) {
                var thisMarkerid = parseInt(imageData[i].Marker_id);
                var markerFound = false;

                for (var j in temp_markers) {
                    if (parseInt(temp_markers[j]) === thisMarkerid) {
                        markerFound = true;
                        break;
                    }
                }

                if (!markerFound) {
                    temp_markers.push(thisMarkerid);
                }
            }

            for (let i in temp_markers) {
                let thisMarkerid = parseInt(temp_markers[i]);

                for (var j in imageData) {
                    if (parseInt(imageData[j].Marker_id) === thisMarkerid) {
                        fetchedImage["marker_positions"][i] = {
                            m_id: thisMarkerid,
                            top: parseFloat(imageData[j].markerTop),
                            left: parseFloat(imageData[j].markerLeft),
                            color: imageData[j].color,
                            animation_type: imageData[j].animation_type,
                            marker_type: imageData[j].marker_type,
                            marker_image: imageData[j].marker_image,
                            background_color: imageData[j].background_color,
                            border_radius: imageData[j].border_radius,
                            popup_id: thisMarkerid,
                        };

                        popupContent.push({
                            id: thisMarkerid,
                            popup_content: [],
                        });
                        break;
                    }
                }

                var temp_popup_contents = [];

                for (var h in imageData) {
                    if (parseInt(imageData[h].Markers_id) === thisMarkerid) {
                        /* TODO: Add carousel slide order */

                        if (imageData[h].widget_type_id === Widget_ID.CarouselWidget) {
                            console.log(JSON.parse(imageData[h].content));
                            let temp_carousel_content = JSON.parse(imageData[h].content);
                            imageData[h].content = JSON.stringify(
                                temp_carousel_content.sort((a, b) => a.order_no - b.order_no)
                            );
                        }

                        temp_popup_contents.push({
                            id: imageData[h].Popup_Contents_id,
                            widget_type_id: imageData[h].widget_type_id,
                            order_no: imageData[h].order_no,
                            src: imageData[h].content,
                            marker_id: thisMarkerid,
                        });
                    }
                }

                popupContent[i]["popup_content"] = temp_popup_contents;
            }

            // Sorting popup contents by order_no
            for (var k in popupContent) {
                let content = popupContent[k].popup_content;
                // console.log(content);
                popupContent[k].popup_content = content.sort(function (a, b) {
                    return parseInt(a.order_no) - parseInt(b.order_no);
                });
            }

            console.log(fetchedImage);
            //   setPopups(popupContent);
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
        const asyncF = async () => {
            await fetchImage();
            await Marker.positionMarkers(itemsRef);

        };
        asyncF();

    }, [fetchImage]);

    return (
        <React.Fragment>
            {loaded ? (
                <div className="container text-center imageMarker"
                    id="imageMarkerWrapper"
                >
                    <img
                        className={`target rounded img-fluid w-75 shadow ${loaded ? "" : "d-none"
                            }`}
                        alt="empty"
                        src={image.url}
                        onLoad={() => setLoaded(true)}
                    />

                    <React.Fragment>
                        <div className="points_wrap">
                            {image.marker_positions.map((image_position, index) => (
                                <React.Fragment key={index}>
                                    <Hotspot
                                        ref={(el) => (itemsRef.current[index] = el)}
                                        key={index}
                                        markers={image_position}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </React.Fragment>


                </div>
            ) : null}
        </React.Fragment>
    );
}

export default EmbedPage;


const Hotspot = React.forwardRef((props, ref) => {

    return (
        <div className={`item-point circle pulse2`}
            data-top={props.markers.top}
            id={props.markers.m_id}
            data-left={props.markers.left}
            data-key={props.markers.m_id}
            key={props.markers.m_id}
            // data-popupid={`#popup` + props.image_position.popup_id}
            data-popupid={`#popup` + props.markers.popup_id}

        >
            <div>
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="toggle"
                >
                    {`#popup` + props.markers.popup_id}
                    {`#popup` + props.markers.top}
                    {`#popup` + props.markers.left}
                </a>
            </div>
        </div>
    )

});
