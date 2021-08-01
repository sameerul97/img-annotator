import React, { useState, useEffect } from "react";

// const Hotspot = React.forwardRef((props, ref) => {
const Popup = (props) => {
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const [widgets, setWidgets] = useState();
    const [iframeSrc, setIframeSrc] = useState();

    useEffect(() => {
        setWidgets(props.widgets);
        // console.log(props.markers)
        // setTop(props.markers.top);
        // setLeft(props.markers.left);
        setIframeSrc(props.widgets);
    }, [props]);
    
    useEffect(() => {
        setTop(
            isNaN(props.markers.top * props.width)
                ? 0
                : parseFloat(props.markers.top * props.width)
        );

        setLeft(
            isNaN(props.markers.left * props.width)
                ? 0
                : parseFloat(props.markers.left * props.width)
        );
    }, [props.markers.top, props.markers.left, props.width]);

    // let popupWidgets = <EmbedLoading />;

    return (

        <div
            className="video_wrapper_on_drag w-25 position-relative"
            style={{ top: top, left: left }}
        >
            {top}{left}
            <div className="embed-container">
                <iframe
                    width="560"
                    height="315"
                    className="border-0"
                    src={iframeSrc}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    title="video_"
                ></iframe>
            </div>
        </div>

    );
};

export default Popup;
