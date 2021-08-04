import React, { useState, useEffect,useContext } from "react";
import useCheckMobileScreen from '../../hooks/useCheckMobileScreen';
import { Context } from '../../store/EmbedStore';

const Popup = (props) => {
    const [popupStyle, setPopupStyle] = useState();
    const [iframeSrc, setIframeSrc] = useState();
    const isMobileScreen = useCheckMobileScreen();
    const [isLeft, setIsLeft] = useState();
    const [widgets, setWidgets] = useState();

  const [state] = useContext(Context)


    useEffect(() => {
        // setWidgets(props.widgets);
        // setIframeSrc(props.widgets);
    }, [props]);

    useEffect(() => {
        let _width = props.width;
        let _naturalImageWidth = props.naturalImageWidth;

        let _left = isNaN(props.markers.left * _width / _naturalImageWidth)
            ? 0
            : parseFloat(props.markers.left * _width / _naturalImageWidth);

        let _top = isNaN(props.markers.top * _width / _naturalImageWidth)
            ? 0
            : parseFloat(props.markers.top * _width / _naturalImageWidth) / 2;

        if (!isMobileScreen) {
            if (_left >= (_width / 100) * 58) {
                setPopupStyle({
                    top: _top,
                    right: _width - _left + 25
                })
                setIsLeft(false);
            } else {
                console.log('left');
                setPopupStyle({
                    top: _top,
                    left: _left
                })
                setIsLeft(true);
            }
        }
    }, [props.markers.top, props.markers.left, props.width, props.naturalImageWidth, isMobileScreen]);
    
    console.log(state.loading);

    if(state.loading){
        console.log("Loading");
        return(
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        )
    }

    return (
        <div style={popupStyle} className="pointBox showflip smoothTransition">
            <PopupBoxArrow isLeft={isLeft} isMobileScreen={isMobileScreen} top={props.markers.top} width={props.width / props.naturalImageWidth} />
            <PopupCloseButton closePopup={props.closePopup} />
            <div className="video_wrapper_on_drag py-5 px-2 position-relative">
                <div className="embed-container">
                    <iframe
                        width="560"
                        height="315"
                        className="border-0"
                        src={state.selectedPopup}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        title="video_"
                    />
                </div>
            </div>
        </div>
    );
};

export default Popup;

const PopupBoxArrow = ({ isMobileScreen, top, width, isLeft }) => {
    const arrowStyle = {
        top: (parseFloat(top * width)) / 2 + 25,
        right: !isLeft ? -18 : 'unset',
        left: isLeft ? -17 : 'unset'
    }

    return (
        <div className="pointBoxArrow smoothTransition" style={arrowStyle}>
            {!isLeft ?
                <svg
                    width="20"
                    className="pointBoxArrowRight d-block"
                    height="53"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192 512"
                >
                    <path
                        fill="#ffffff"
                        d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"
                    ></path>
                </svg>
                :
                <svg
                    width="20"
                    className="pointBoxArrowLeft d-block"
                    height="53"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192 512"
                >
                    <path
                        fill="#ffffff"
                        d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
                    ></path>
                </svg>
            }

        </div>
    )
};


const PopupCloseButton = ({ closePopup }) => {
    const [state, dispatch] = useContext(Context)

    return(
        <div className="pointBoxClose exit" onClick={()=> {dispatch({ type: 'CLOSE_SELECTED_POPUP'})}}>
            <div className="pointBoxCloseIcon">
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="black" strokeWidth="1">
                        <path d="M2 14L14 2M2 2l12 12"></path>
                    </g>
                </svg>
            </div>
        </div>
    );
}

