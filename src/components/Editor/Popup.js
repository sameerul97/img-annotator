import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

import Marker from "../../lib/Marker";

import { ReactComponent as DragLogo } from "../../assets/drag.svg";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Widget_ID } from "../Widgets";

import PopupImageWidget from "./PopupWidgets/PopupImageWidget";
import PopupVideoWidget from "./PopupWidgets/PopupVideoWidget";
import PopupHeaderWidget from "./PopupWidgets/PopupHeaderWidget";
import PopupParagraphWidget from "./PopupWidgets/PopupParagraphWidget";
import PopupButtonWidget from "./PopupWidgets/PopupButtonWidget";
import PopupFreeTextWidget from "./PopupWidgets/PopupFreeTextWidget";
import PopupCarouselWidget from "./PopupWidgets/PopupCarouselWidget";

import API from "../../api/index";

const grid = 6;

const getItemStyle = (isDragging, draggableStyle) => {
  if (isDragging.isDropAnimating) {
    return draggableStyle;
  }
  return {
    userSelect: "none",
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "#117a8b" : "#19a2b8",
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "red" : "lightgrey",
  padding: grid,
});

function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      // console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}

function Popup(props, ref) {
  const [popupItems, setPopupItems] = useState({ items: {} });
  const [popupPositions, setPopupPositions] = useState(false);
  const [popupReady, setPopupReady] = useState(false);
  const [popupWidgetBeingEdited, setPopupWidgetBeingEdited] = useState([]);

  useTraceUpdate(props);

  useLayoutEffect(() => {
    setPopupItems({ items: props.data.popup_content });

    async function fetchData() {
      await Marker.positionPopup(props.positions, function (res) {
        setPopupPositions({ top: res.top + "px", left: res.left + "px" });
      });
    }

    fetchData();
  }, [props]);

  useLayoutEffect(() => {
    setPopupReady(true);
  }, [props.data.id, props.positions, popupReady]);

  useLayoutEffect(() => {
    function updateSize() {
      Marker.adjustPopupBoxContainer(
        props.data.id,
        props.positions,
        function () {
          setPopupReady(true);
        }
      );
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [props]);

  const [popupEditModeSelected, setPopupEditModeSelected] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  const WidgetSelected = ({ item }) => {
    switch (item.widget_type_id) {
      case Widget_ID.ImageWidget:
        return (
          <PopupImageWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            popupItems={popupItems}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );
      case Widget_ID.HeaderWidget:
        return (
          <PopupHeaderWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );

      case Widget_ID.ParagraphWidget:
        return (
          <PopupParagraphWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );

      case Widget_ID.ButtonWidget:
        return (
          <PopupButtonWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );

      case Widget_ID.VideoWidget:
        return (
          <PopupVideoWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            popupItems={popupItems}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );

      case Widget_ID.FreeTextWidget:
        return (
          <PopupFreeTextWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
          />
        );

      case Widget_ID.CarouselWidget:
        return (
          <PopupCarouselWidget
            data={item}
            popupContentChanged={props.popupContentChanged}
            popupEditModeSelected={popupEditModeSelected}
            deleteAWidget={deleteAWidget}
            popupWidgetBeingEdited={popupWidgetBeingEdited}
            setPopupWidgetBeingEdited={setPopupWidgetBeingEdited}
            addASlideInCarousel={props.addASlideInCarousel}
            deleteASlideInCarousel={props.deleteASlideInCarousel}
            updateASlideInCarousel={props.updateASlideInCarousel}
            updateCarouselSlidesOrder={props.updateCarouselSlidesOrder}
          />
        );

      default:
        return <h1 className="text-dark">Widget not implemented</h1>;
    }
  };

  const popupEditStyle = {
    position: "absolute",
    top: "-25px",
    left: 0,
    padding: "5px 10px",
    margin: "-10px 0px 0px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
  };

  function editButtonClick() {
    if (!popupEditModeSelected) {
      props.setPopupEditMode(true);
      setPopupEditModeSelected(true);
      setAnimateElements(true);
      setTimeout(() => {
        setAnimateElements(false);
      }, 400);
    } else {
      props.setPopupEditMode(false);
      setAnimateElements(true);
      setTimeout(() => {
        setAnimateElements(false);
      }, 400);

      let popups = props.data.popup_content;

      for (var i in popups) {
        popups[i].order_no = i;
      }

      // TODO: get saved data Post to save reorder
      API.post(
        `/popup_widget/save_order.php/`,
        {
          marker_id: parseInt(props.data.id),
          popup_content: popups,
        },
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      setPopupEditModeSelected(false);
    }
  }

  const deleteAWidget = (e) => {
    let widgetId = e.currentTarget.id;

    API.delete(`/popup_widget/index.php`, {
      data: {
        marker_id: props.data.id,
        popup_widget_id: widgetId,
      },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setPopupItems((prevState) => {
          return {
            items: prevState.items.filter(
              (widget) => parseInt(widget.id) !== widgetId
            ),
          };
        });

        props.setPopups(function (prevState) {
          return prevState.map((popup, index) => {
            if (parseInt(popup.id) === parseInt(props.data.id)) {
              return {
                ...popup,
                popup_content: popup.popup_content.filter(
                  (widget) => widget.id !== widgetId
                ),
              };
            } else {
              return popup;
            }
          });
        });
      })
      .catch((err) => {
        let error = err.response.data;

        // 440 token expired / token tamperred
        if (error.message === "Expired token") {
          props.history.push(`/login/`);
        }
      });
  };

  const EditButton = () => (
    <button
      className="btn-sm btn badge badge-secondary text-white bg-info"
      style={popupEditStyle}
      onClick={(e) => editButtonClick()}
      disabled={popupWidgetBeingEdited.length > 0}
    >
      {!popupEditModeSelected ? "Edit Layout" : "Save Layout"}

      <DragLogo className="mx-1" />
    </button>
  );

  return (
    <React.Fragment>
      {popupReady ? (
        <div
          styles={popupPositions !== false ? popupPositions : ""}
          className="pointBox showflip"
          id={"popup" + props.data.id}
        >
          <EditButton />
          <PopupBoxContainer />

          {!popupEditModeSelected ? (
            <PopupCloseButton
              closeThisPopup={() => {
                props.setPopupModeMarkerSelected(false);
                setPopupWidgetBeingEdited(() => [{}]);
              }}
            />
          ) : undefined}

          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={popupEditModeSelected ? getListStyle() : undefined}
                className={` smoothTransition ${
                  popupEditModeSelected ? "" : "pb-0"
                }`}
              >
                {popupItems.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={
                      !popupEditModeSelected || props.newWidgetBeingAdded
                    }
                  >
                    {(provided, snapshot) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={
                            popupEditModeSelected
                              ? getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )
                              : undefined
                          }
                          className={`${
                            animateElements ? "smoothTransition" : undefined
                          }`}
                        >
                          {WidgetSelected({ item: item })}
                          {/* Calling widgetSelected prevents child from rerendering
                          if we use  <WidgetSelected> it causes to rerender on any change */}
                          {/* <WidgetSelected item={item}></WidgetSelected> */}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ) : undefined}
    </React.Fragment>
  );
}

export default Popup;

const PopupCloseButton = ({ closeThisPopup }) => (
  <div className="pointBoxClose exit" onClick={() => closeThisPopup()}>
    <div className="pointBoxCloseIcon">
      <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="black" strokeWidth="1">
          <path d="M2 14L14 2M2 2l12 12"></path>
        </g>
      </svg>
    </div>
  </div>
);

const PopupBoxContainer = () => (
  <div>
    <div className="pointBoxArrow">
      <svg
        width="20"
        className="pointBoxArrowRight"
        height="53"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 192 512"
      >
        <path
          fill="#ffffff"
          d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"
        ></path>
      </svg>
      <svg
        width="20"
        className="pointBoxArrowLeft"
        height="53"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 192 512"
      >
        <path
          fill="#ffffff"
          d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
        ></path>
      </svg>
    </div>
  </div>
);
