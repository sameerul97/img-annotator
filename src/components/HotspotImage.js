import React, { useState, useEffect, useRef, useCallback } from "react";
import $ from "jquery";
import "../Marker.css";
import Marker from "../lib/Marker";
import interact from "interactjs";

import Markers from "./Marker";
import Popup from "./Popup";
import MarkerEditorPanel from "./MarkerEditorPanel";
import ColorPicker from "./ColorPicker";
import Toast from "./Toast";
import PopupWidgets from "./PopupWidgets";
import API from "../api";

import { DragDropContext } from "react-beautiful-dnd";
import { Widgets, Widget_ID } from "./Widgets";
import { HashRouter, Link } from "react-router-dom";


function HotspotImage(props) {
  const itemsRef = useRef([]);
  const editMarkerRef = useRef(false);
  const deleteMarkerRef = useRef(false);
  // TODO: Remove widgetPanelref (testing required)
  const widgetPanelRef = useRef(false);
  // const [widgetPanelWidth, setWidgetPanelWidth] = useState(false);
  // const [widgetPanelHeight, setWidgetPanelHeight] = useState(false);
  const DraggableElement = ".item-point";

  const [imageNotFoundError, setImageNotFoundError] = useState(false);
  const [imageNotFoundErrorMessage, setImageNotFoundErrorMessage] =
    useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [loaded, setLoaded] = useState(false);
  // image state holds all the markers
  const [image, setImage] = useState({});
  const [popups, setPopups] = useState(false);

  // toggling to popupView [used with Marker Editor panel
  // to hide Add and Delete marker button]
  const [popupView, setPopupView] = useState(false);
  // Holds currently selected marker -> to show selected item border, delete
  // TODO: Rename below to [selectedMarkerInMarkerMode, setSelectedMarkerInMarkerMode]
  const [selectedMarker, setSelectedMarker] = useState(false);

  // keeps track of popup which are deleted
  const [popupToBeDeleted, setPopupToBeDeleted] = useState(false);
  // Used when a popup edit button is clicked
  // Why: To show Widgets.js / Widget panel only when popupEditButton is clicked
  const [popupEditMode, setPopupEditMode] = useState(false);

  // Holds currently clicked marker in popup mode -> to prevent user from clicking other markers when popup already is opened
  // TODO: Rename below to [selectedMarkerInPopupMode, setSelectedMarkerInPopupMode]
  const [popupModeMarkerSelected, setPopupModeMarkerSelected] = useState(false);
  // Show warning message -> when popup is already opened and clicking another popup marker
  const [showToast, setShowToast] = useState(false);

  // new widget being added in db
  const [newWidgetBeingAdded, setNewWidgetBeingAdded] = useState(false);

  // if image is portrait
  const [isPortrait, setIsPortrait] = useState(false);

  function updateMarkerTopAndLeft(marker_index, left, top) {
    setImage((prevState) => {
      return {
        ...prevState,
        marker_positions: prevState.marker_positions.map((marker, index) => {
          if (parseInt(marker.m_id) === parseInt(marker_index)) {
            return {
              ...marker,
              top: top,
              left: left,
            };
          } else {
            return marker;
          }
        }),
      };
    });
  }

  function addNewMarker() {
    API.post(
      `/marker/`,
      {
        image_id: parseInt(image.id),
      },
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        let new_marker = res.data.new_marker[0];
        let new_popup = res.data.new_popup;
        new_popup.id = parseInt(res.data.new_popup.id);

        let temp_new_marker;
        temp_new_marker = {
          m_id: parseInt(new_marker.id),
          top: parseFloat(new_marker.markerTop),
          left: parseFloat(new_marker.markerLeft),
          color: new_marker.color,
          animation_type: new_marker.animation_type,
          marker_type: new_marker.marker_type,
          marker_image: new_marker.marker_image,
          background_color: new_marker.background_color,
          border_radius: new_marker.border_radius,
          popup_id: parseInt(new_marker.id),
        };

        setImage((prevState) => {
          return {
            ...prevState,
            marker_positions: [...prevState.marker_positions, temp_new_marker],
          };
        });

        var temp_popup_contents = [];

        for (var h in new_popup.popup_content) {
          temp_popup_contents.push({
            id: new_popup.popup_content[h].id,
            widget_type_id: new_popup.popup_content[h].widget_type_id,
            src: new_popup.popup_content[h].content,
            marker_id: new_marker.id,
          });
        }
        new_popup["popup_content"] = temp_popup_contents;
        new_popup["id"] = parseInt(new_marker.id);

        setPopups((prevState) => {
          return [...prevState, new_popup];
        });
      })
      .catch((err) => {
        let errorResponse = err.response;
        let error = err.response.data;

        if (error.message === "Expired token") {
          props.history.push(`/login/`);
        }
      });
  }

  function dragEndListener(event) {
    var str = $(event.target).css("transform");
    var x = str.split(",");
    var len = x.length;
    var xPos = parseInt(x[len - 2]);
    var yPos = parseInt(x[len - 1]);

    var imageMetric = Marker.getImageMetric(
      $(".imageMarker"),
      function (imageMetric) {
        var css_data_left, css_data_top;

        if (xPos < 0) {
          css_data_left = parseInt($(event.target).css("left")) + xPos;
          css_data_top = parseInt($(event.target).css("top")) + yPos;
        } else {
          css_data_left = parseInt($(event.target).css("left")) + xPos;
          css_data_top = parseInt($(event.target).css("top")) + yPos;
        }

        var data_left_multiplier = css_data_left / imageMetric.getWidthLess;
        var natural_image_left = data_left_multiplier * imageMetric.width;
        // console.log(css_data_left, data_left_multiplier, natural_image_left);

        var data_right_multiplier = css_data_top / imageMetric.setHeight;
        var natural_image_top = data_right_multiplier * imageMetric.height;

        updateMarkerTopAndLeft(
          event.target.getAttribute("data-key"),
          natural_image_left,
          natural_image_top
        );
      }
    );
  }

  function dragMoveListener(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
      y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  const onColorSelected = (color) => {
    setImage((prevState) => {
      return {
        ...prevState,
        marker_positions: prevState.marker_positions.map((marker, index) => {
          if (parseInt(marker.m_id) === parseInt(selectedMarker.markerId)) {
            return {
              ...marker,
              color: color.hex,
            };
          } else {
            return marker;
          }
        }),
      };
    });
  };

  const deleteMarker = (event) => {
    API.delete("/marker/", {
      data: {
        marker_id: parseInt(selectedMarker.markerId),
        popup_id: parseInt(selectedMarker.popupId),
      },
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        /**
         * Delete marker and its popup in client side.
         * since its deleted on db */
        if (image.marker_positions.length > 1) {
          setPopupToBeDeleted({
            popupId: parseInt(selectedMarker.popupId),
          });

          setImage((prevState) => {
            return {
              ...prevState,
              marker_positions: prevState.marker_positions.filter(
                (marker) => marker.m_id !== parseInt(selectedMarker.markerId)
              ),
            };
          });

          setPopups((prevState) => {
            return prevState.filter(
              (popup) => popup.id !== parseInt(selectedMarker.popupId)
            );
          });

          setSelectedMarker(false);
        }
      })
      .catch((err) => {
        let error = err.response.data;
        let errorResponse = err.response;

        if (error.message === "Expired token") {
          props.history.push(`/login/`);
        }

        if (errorResponse.status === 401) {
          setError(error.error);
          setErrorMessage(error.message);
        }

        if (errorResponse.status === 400) {
          if (error.validationError) {
            if (Object.keys(error.message)[0] === "marker_id") {
              setError(error.error);
              setErrorMessage(error.message[Object.keys(error.message)[0]][0]);
            }
          }
        }
      });
  };

  // const { id } = props.match.params;
  const { id } = props.id;

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

      setPopups(popupContent);
      setImage(fetchedImage);
      setLoaded(true);

      intiateInteractJS();
    } catch (error) {
      let errorResponse = error.response;

      if (errorResponse.data.message === "Expired token") {
        props.history.push(`/login/`);
      }

      if (errorResponse.status === 404) {
        setImageNotFoundError(true);
        setImageNotFoundErrorMessage(errorResponse.data.message);
      }
    }

    return;
  }, []);

  const intiateInteractJS = () => {
    interact(DraggableElement)
      .draggable({
        inertia: true,
        autoScroll: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
          }),
        ],
        onmove: dragMoveListener,
      })
      .on("dragend", dragEndListener);

    window.$(function () {
      window
        .$('[data-toggle="tooltip"]')
        .tooltip({ delay: { show: 0, hide: 100 }, trigger: "hover" });
    });
  };

  const updateMarkersPosition = () => {
    Marker.positionMarkers(itemsRef);
  };

  const handleClickInside = (e) => {
    if (
      !itemsRef.current.includes(e.target) &&
      !editMarkerRef.current.contains(e.target) &&
      !deleteMarkerRef.current.contains(e.target)
    ) {
      setSelectedMarker(false);
    }
  };

  const imageClick = (e) => {
    if (!itemsRef.current.includes(e.target)) {
      setSelectedMarker(false);
    }
  };

  useEffect(() => {
    /**
     * Using this apporach to add click listerner only for imageMarkerWrapper el,
     * Con: Side effect when toggling between drag and popup mode. pulse Animation delay.
     * */
    if (loaded) {
      document
        .getElementById("imageMarkerWrapper")
        .addEventListener("mousedown", imageClick);
      return () => {
        document
          .getElementById("imageMarkerWrapper")
          .removeEventListener("mousedown", imageClick);
      };
    }
  }, [loaded]);

  useEffect(() => {
    const asyncF = async () => {
      await fetchImage();
      await Marker.positionMarkers(itemsRef);
    };

    asyncF();
    window.addEventListener("resize", updateMarkersPosition);

    return () => {
      window.removeEventListener("resize", updateMarkersPosition);

      interact(DraggableElement).unset();
    };
  }, [fetchImage]);

  useEffect(() => {
    let effectActive = true;

    if (loaded) {
      // itemsRef.current = itemsRef.current.slice(
      //   0,
      //   image.marker_positions.length
      // );

      // setting image width whether its portrait or landscape
      let newImage = new Image();

      newImage.src = image.url;
      newImage.onload = function () {
        if (effectActive) {
          if (newImage.naturalWidth > newImage.naturalHeight) {
            setIsPortrait(false);
          } else if (newImage.naturalWidth < newImage.naturalHeight) {
            setIsPortrait(true);
          } else {
            setIsPortrait(false);
          }
        }
      };
    }
    return () => {
      effectActive = false;
    };
  }, [loaded, image, setPopups]);

  useEffect(() => {
    // setTimeout(() => Marker.positionMarkers(itemsRef), 100);

    if (image.id) {
      API.put(
        `/marker/`,
        {
          image_id: parseInt(image.id),
          markers: image,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          setError(false);
          setErrorMessage(null);
        })
        .catch((err) => {
          let errorResponse = err.response;
          let error = err.response.data;

          if (error.message === "Expired token") {
            // TODO: Show login inside modal and continue
            props.history.push(`/login/`);
          }
          // TODO:Handle 403 forbibdden

          // TODO:Handle 400 for client validation error

          if (errorResponse.status === 401) {
            setError(error.error);
            setErrorMessage(error.message);
          }

          if (errorResponse.status === 400) {
            if (error.validationError) {
              if (Object.keys(error.message)[0] === "image_id") {
                setError(error.error);
                setErrorMessage(
                  error.message[Object.keys(error.message)[0]][0]
                );
              }
            }
          }
        });
    }
  }, [image, props]);

  // useEffect(() => {
  //   const mockDb = JSON.parse(localStorage.getItem("mockDatabase"));
  //   let newDbData = [];

  //   for (var i in mockDb) {
  //     if (mockDb[i].id === image.id) {
  //       newDbData.push(image);
  //     } else {
  //       newDbData.push(mockDb[i]);
  //     }
  //   }
  // }, [image]);

  // useEffect(() => {
  //   const mockPopUpDb = JSON.parse(localStorage.getItem("mockPopUpDatabase"));
  //   let newPopupDbData = [];
  //   if (popups !== false) {
  //     // finding all the popup which relates to this image
  //     for (var i in mockPopUpDb) {
  //       let popupFound = false;
  //       for (var popup in popups) {
  //         if (mockPopUpDb[i].id === popups[popup].id) {
  //           popupFound = true;
  //           break;
  //         }
  //       }
  //       if (popupFound) {
  //         newPopupDbData.push(popups[popup]);
  //       } else {
  //         newPopupDbData.push(mockPopUpDb[i]);
  //       }
  //     }

  //     // check if there is any new popup
  //     for (var aPopup in popups) {
  //       let newPopupFound = true;
  //       for (var popupInMockDb in mockPopUpDb) {
  //         if (mockPopUpDb[popupInMockDb].id === popups[aPopup].id) {
  //           newPopupFound = false;
  //         }
  //       }
  //       if (newPopupFound) {
  //         newPopupDbData.push(popups[aPopup]);
  //       }
  //     }
  //     if (popupToBeDeleted) {
  //       newPopupDbData = newPopupDbData.filter((popup) => {
  //         return parseInt(popup.id) !== parseInt(popupToBeDeleted.popupId);
  //       });
  //       setPopupToBeDeleted(false);
  //     }
  //   }
  // }, [popups, setPopups]);

  const enablePopupView = (event) => {
    setPopupView(true);
    interact(DraggableElement).unset();
    setSelectedMarker(false);
  };

  const enableDraggableMode = (event) => {
    intiateInteractJS();
    setPopupView(false);
    setPopupEditMode(false);
  };

  function popupContentChanged(
    popup_widget_id,
    content,
    widget_type_id,
    image_url
  ) {
    const formData = new FormData();

    formData.append("image", content);
    formData.append("marker_id", parseInt(popupModeMarkerSelected.markerId));
    formData.append("popup_widget_id", popup_widget_id);
    formData.append("widget_type_id", widget_type_id);
    formData.append("image_url", image_url);

    if (widget_type_id === "widget_id_2") {
      API.post(`/popup_widget/update_image.php`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setPopups((prevState) => {
            return prevState.map((popup, index) => {
              if (
                parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
              ) {
                return {
                  ...popup,
                  popup_content: prevState[index].popup_content.map(
                    (popup_content_widget, index) => {
                      if (popup_content_widget.id === popup_widget_id) {
                        return {
                          ...popup_content_widget,
                          src: res.data,
                        };
                      } else {
                        return popup_content_widget;
                      }
                    }
                  ),
                };
              } else {
                return popup;
              }
            });
          });

          setError(false);
          setErrorMessage(null);
        })
        .catch((err) => {
          let errorResponse = err.response;
          let error = err.response.data;
          // 440 token expired / token tamperred
          if (error.message === "Expired token") {
            // TODO: Show login inside modal and continue
            props.history.push(`/login/`);
          }
          // TODO: Handle 403 forbibdden error

          if (errorResponse.status === 401) {
            setError(error.error);
            setErrorMessage(error.message);
          }

          if (errorResponse.status === 400) {
            if (error.validationError) {
              if (Object.keys(error.message)[0] === "image_id") {
                setError(error.error);
                setErrorMessage(
                  error.message[Object.keys(error.message)[0]][0]
                );
              }
            }
          }
        });
    } else {
      API.put(
        `/popup_widget/`,
        {
          marker_id: parseInt(popupModeMarkerSelected.markerId),
          popup_widget_id: popup_widget_id,
          content: content,
          widget_type_id: widget_type_id,
        },
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => {
          setError(false);
          setErrorMessage(null);
          console.log(res);
        })
        .catch((err) => {
          let errorResponse = err.response;
          let error = err.response.data;

          // 440 token expired / token tamperred
          if (error.message === "Expired token") {
            // TODO: Show login inside modal and continue
            props.history.push(`/login/`);
          }

          // TODO: Handle 403 forbibdden error

          if (errorResponse.status === 401) {
            setError(error.error);
            setErrorMessage(error.message);
          }

          if (errorResponse.status === 400) {
            if (error.validationError) {
              if (Object.keys(error.message)[0] === "image_id") {
                setError(error.error);
                setErrorMessage(
                  error.message[Object.keys(error.message)[0]][0]
                );
              }
            }
          }
        });
    }

    setPopups((prevState) => {
      return prevState.map((popup, index) => {
        if (parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)) {
          return {
            ...popup,
            popup_content: prevState[index].popup_content.map(
              (popup_content_widget, index) => {
                if (popup_content_widget.id === popup_widget_id) {
                  return {
                    ...popup_content_widget,
                    src: content,
                  };
                } else {
                  return popup_content_widget;
                }
              }
            ),
          };
        } else {
          return popup;
        }
      });
    });
  }

  /**
   *  isImageSlide param == true if image slide is clicked. isImageSlide is false if video slide clicked
   */
  const addASlideInCarousel = async (
    popup_widget_id,
    isImageSlide,
    callback
  ) => {
    try {
      let slideCreated = await API.get(`/popup_widget/carousel_widget.php`, {
        params: {
          popup_widget_id: parseInt(popup_widget_id),
          marker_id: parseInt(parseInt(popupModeMarkerSelected.markerId)),
          imageSlide: isImageSlide,
        },
      });

      setPopups((prevState) => {
        return prevState.map((popup, index) => {
          if (
            parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
          ) {
            return {
              ...popup,
              popup_content: prevState[index].popup_content.map(
                (popup_content_widget, index) => {
                  if (popup_content_widget.id === popup_widget_id) {
                    return {
                      ...popup_content_widget,
                      src: JSON.stringify(slideCreated.data),
                    };
                  } else {
                    return popup_content_widget;
                  }
                }
              ),
            };
          } else {
            return popup;
          }
        });
      });

      callback(false);
    } catch (error) {
      callback(true);
      console.log(error);
    }
  };

  /**
   *   Handles both image and video slide update
   */
  const updateASlideInCarousel = async (
    popup_widget_id,
    slide_id,
    slide_caption,
    slide_type,
    image_file,
    is_image_url,
    image_src_changed,
    video_src,
    video_src_changed,
    callback
  ) => {
    try {
      const formData = new FormData();

      formData.append("image", image_file);
      formData.append("marker_id", parseInt(popupModeMarkerSelected.markerId));
      formData.append("popup_widget_id", popup_widget_id);
      formData.append("slide_id", slide_id);
      formData.append("image_url", is_image_url);
      formData.append("image_src_changed", image_src_changed);
      formData.append("slide_caption", slide_caption);
      formData.append("slide_type", slide_type);
      formData.append("video_src", video_src);
      formData.append("video_src_changed", video_src_changed);

      let imageUpdated = await API.post(
        `/popup_widget/carousel_widget.php`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      let ordered_carousel_slides = imageUpdated.data.sort(function (a, b) {
        return a.order_no - b.order_no;
      });

      setPopups((prevState) => {
        return prevState.map((popup, index) => {
          if (
            parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
          ) {
            return {
              ...popup,
              popup_content: prevState[index].popup_content.map(
                (popup_content_widget, index) => {
                  if (popup_content_widget.id === popup_widget_id) {
                    return {
                      ...popup_content_widget,
                      src: JSON.stringify(ordered_carousel_slides),
                    };
                  } else {
                    return popup_content_widget;
                  }
                }
              ),
            };
          } else {
            return popup;
          }
        });
      });

      let newCarouselData = imageUpdated.data;
      let newImageSrc, newSlideCaption;

      for (let carousel in newCarouselData) {
        if (newCarouselData[carousel].id === slide_id) {
          newImageSrc = newCarouselData[carousel].src;
          newSlideCaption = newCarouselData[carousel].caption;
        }
      }

      callback(false, null, newImageSrc, newSlideCaption);
    } catch (error) {
      callback(true, error);
    }
  };

  // slide_id === slide_id inside the carousel
  const deleteASlideInCarousel = async (
    popup_widget_id,
    slide_id,
    callback
  ) => {
    try {
      let slideCreated = await API.delete(`/popup_widget/carousel_widget.php`, {
        data: {
          popup_widget_id: parseInt(popup_widget_id),
          marker_id: parseInt(parseInt(popupModeMarkerSelected.markerId)),
          slide_id: slide_id,
        },
      });

      setPopups((prevState) => {
        return prevState.map((popup, index) => {
          if (
            parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
          ) {
            return {
              ...popup,
              popup_content: prevState[index].popup_content.map(
                (popup_content_widget, index) => {
                  if (popup_content_widget.id === popup_widget_id) {
                    return {
                      ...popup_content_widget,
                      src: JSON.stringify(slideCreated.data),
                    };
                  } else {
                    return popup_content_widget;
                  }
                }
              ),
            };
          } else {
            return popup;
          }
        });
      });

      callback(false);
    } catch (error) {
      callback(true);
      console.log(error);
    }
  };

  /* Updates Carousel slide order */
  const updateCarouselSlidesOrder = async (
    popup_widget_id,
    content,
    widget_type_id
  ) => {
    let carousel_slide_update = await API.put(
      `/popup_widget/carousel_widget.php`,
      {
        marker_id: parseInt(popupModeMarkerSelected.markerId),
        popup_widget_id: popup_widget_id,
        content: content,
        widget_type_id: widget_type_id,
      },
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    // Sorting popup contents by order_no
    let ordered_carousel_slides = carousel_slide_update.data.sort(function (
      a,
      b
    ) {
      return a.order_no - b.order_no;
    });

    setPopups((prevState) => {
      return prevState.map((popup, index) => {
        if (parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)) {
          return {
            ...popup,
            popup_content: prevState[index].popup_content.map(
              (popup_content_widget, index) => {
                if (popup_content_widget.id === popup_widget_id) {
                  return {
                    ...popup_content_widget,
                    src: JSON.stringify(ordered_carousel_slides),
                  };
                } else {
                  return popup_content_widget;
                }
              }
            ),
          };
        } else {
          return popup;
        }
      });
    });
  };

  // TODO: Move these utils f()s DragAndDropUtil.js once drag end implemented
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const widget_uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Move item from one list to other
  const move = (
    source,
    destination,
    draggableId,
    droppableSource,
    droppableDestination
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    var draggedEl = sourceClone.find((el) => el.id === draggableId);

    draggedEl = {
      id: draggedEl.id + "_" + widget_uid(),
      widget_type_id: draggedEl.id,
      src: null,
      marker_id: popupModeMarkerSelected.markerid,
    };

    destClone.splice(droppableDestination.index, 0, draggedEl);
    console.log(draggedEl);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    setNewWidgetBeingAdded(true);

    API.post(
      `/popup_widget/`,
      {
        image_id: parseInt(image.id),
        marker_id: parseInt(popupModeMarkerSelected.markerId),
        widget_type_id: draggedEl.widget_type_id,
        react_widget_id: draggedEl.id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        let new_id = res.data.new_widget_id;
        let temp_react_widget_id = res.data.react_widget_id;

        setPopups(function (prevState) {
          return prevState.map((popup, index) => {
            if (
              parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
            ) {
              return {
                ...popup,
                popup_content: popup.popup_content.map(
                  (content, contextIndex) => {
                    if (content.id === temp_react_widget_id) {
                      return {
                        id: new_id,
                        widget_type_id: res.data.widget_type_id,
                        src: res.data.src,
                        marker_id: popupModeMarkerSelected.markerId,
                      };
                    } else {
                      return content;
                    }
                  }
                ),
              };
            } else {
              return popup;
            }
          });
        });
        setNewWidgetBeingAdded(false);
      })
      .catch((err) => {
        let errorResponse = err.response;
        let error = err.response.data;

        // 440 token expired / token tamperred
        if (error.message === "Expired token") {
          props.history.push(`/login/`);
        }
      });

    return result;
  };

  const [popupWidget, setPopupWidgets] = useState(Widgets);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Sorting in same list
    // post to /popup_contents_reorder/
    if (source.droppableId === destination.droppableId) {
      setPopups(function (prevState) {
        return prevState.map((popup, index) => {
          if (
            parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
          ) {
            return {
              ...popup,
              popup_content: reorder(
                popup.popup_content,
                source.index,
                destination.index
              ),
            };
          } else {
            return popup;
          }
        });
      });
    }

    // Moving between columns
    //  adding new widget
    else {
      console.log(popupModeMarkerSelected);
      setPopups(function (prevState) {
        return prevState.map((popup, index) => {
          if (
            parseInt(popup.id) === parseInt(popupModeMarkerSelected.popupId)
          ) {
            return {
              ...popup,
              popup_content: move(
                popupWidget,
                popup.popup_content,
                draggableId,
                source,
                destination
              ).droppable2,
            };
          } else {
            return popup;
          }
        });
      });
    }
  };

  const saveData = async () => {
    for (var i in popups) {
      for (var j in popups[i].popup_content) {
        popups[i].popup_content[i].order_no = j;
        console.log(popups[i].popup_content[i].popup_content);
      }
    }
  };

  return (
    <React.Fragment>
      {loaded ? (
        <div className="container-fluid mt-4 ml-0" style={{ width: "95%" }}>

          <HashRouter>
            <Link to={`/embed/${image.id}`} target="_blank" rel="noopener noreferrer" >
              EMBED PAGE
            </Link>
          </HashRouter>
          <div className="row text-center text-white mr-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <div
                className="text-left rounded-right col-3 smoothTransition pl-0  pr-0 "
                id="widgetPanel"
                ref={widgetPanelRef}
              >
                <div
                  className={`text-left bg-info rounded-right px-0 smoothTransition h-100 ${selectedMarker || popupEditMode ? "col-md-12" : "col-md-4"
                    }`}
                >
                  <ColorPicker
                    onColorSelected={onColorSelected}
                    selectedMarker={selectedMarker}
                    popupViewEnabled={popupView}
                  ></ColorPicker>

                  {popupEditMode && (
                    <PopupWidgets newWidgetBeingAdded={newWidgetBeingAdded} />
                  )}
                </div>
              </div>

              <div className="mb-4 col-9 ">
                {error && (
                  <div className="col-md-12 mx-auto " role="alert">
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  </div>
                )}

                <MarkerEditorPanel
                  selectedMarker={selectedMarker}
                  addNewMarker={addNewMarker}
                  editRef={editMarkerRef}
                  deleteRef={deleteMarkerRef}
                  deleteMarker={deleteMarker}
                  popupViewEnabled={popupView}
                  enablePopupView={enablePopupView}
                  enableDraggableMode={enableDraggableMode}
                  popupEditMode={popupEditMode}
                  saveData={saveData}
                />
                <div
                  className="imageMarker shadow-lg"
                  id="imageMarkerWrapper"
                  style={
                    isPortrait
                      ? { maxWidth: "850px", margin: "auto" }
                      : { maxWidth: "1080px", margin: "auto" }
                  }
                >
                  {showToast && <Toast />}
                  {loaded ? null : (
                    <div className="text-center w-100 pt-5 mt-5 ">
                      <div className="spinner-grow text-info p-3" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  <img
                    className={`target rounded shadow ${loaded ? "" : "d-none"
                      }`}
                    alt="empty"
                    src={image.url}
                    onLoad={() => setLoaded(true)}
                  />
                  <div className="points_wrap">
                    <div
                      className="image-overlay-onpopup rounded"
                      style={
                        popupModeMarkerSelected ? { opacity: 1 } : undefined
                      }
                    ></div>

                    {image.marker_positions.map((image_position, index) => (
                      <React.Fragment key={index}>
                        <Markers
                          ref={(el) => (itemsRef.current[index] = el)}
                          key={index}
                          markers={image_position}
                          popupViewEnabled={popupView}
                          setSelectedMarker={setSelectedMarker}
                          selectedMarker={selectedMarker}
                          popupModeMarkerSelected={popupModeMarkerSelected}
                          setPopupModeMarkerSelected={
                            setPopupModeMarkerSelected
                          }
                          setShowToast={setShowToast}
                        />
                      </React.Fragment>
                    ))}
                  </div>

                  <React.Fragment>
                    {popups.map((data, index) => (
                      <React.Fragment key={index}>
                        {data.id ===
                          parseInt(popupModeMarkerSelected.popupId) ? (
                          <React.Fragment>
                            <Popup
                              key={index}
                              data={data}
                              popupContentChanged={popupContentChanged}
                              setPopupEditMode={setPopupEditMode}
                              setPopups={setPopups}
                              setPopupModeMarkerSelected={
                                setPopupModeMarkerSelected
                              }
                              positions={{
                                top: image.marker_positions[index].top,
                                left: image.marker_positions[index].left,
                              }}
                              newWidgetBeingAdded={newWidgetBeingAdded}
                              addASlideInCarousel={addASlideInCarousel}
                              deleteASlideInCarousel={deleteASlideInCarousel}
                              updateASlideInCarousel={updateASlideInCarousel}
                              updateCarouselSlidesOrder={
                                updateCarouselSlidesOrder
                              }
                            />
                          </React.Fragment>
                        ) : undefined}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                </div>
              </div>
            </DragDropContext>
          </div>
        </div>
      ) : (
        <React.Fragment>
          {!imageNotFoundError && (
            <div className="text-center w-100 pt-5 mt-5 ">
              <div className="spinner-grow text-primary p-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
      {imageNotFoundError && (
        <div className="col-md-6 mx-auto mt-5 pt-3" role="alert">
          <div className="alert alert-danger" role="alert">
            {imageNotFoundErrorMessage}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default HotspotImage;
