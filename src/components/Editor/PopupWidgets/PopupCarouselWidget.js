import React, { useState, useLayoutEffect, useEffect, createRef } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

function PopupCarouselWidget(props) {
  const [readMode, setReadMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [highlightedBackground, seHighlightedBackground] = useState(false);
  const [carouselData, setCarouselData] = useState(false);

  const [arrLength, setArrLength] = useState();
  const [elRefs, setElRefs] = useState([]);
  const [newlyAdded, setnewlyAdded] = useState(false);

  /**
   * isCarouselLoading is true when new slide is being added / slide is being deleted
   */
  const [isCarouselLoading, setIsCarouselLoading] = useState(false);

  /**
   * isSlideBeingEdited becomes true when "Edit" is clicked on carousel slide
   * so we can disable cancel and save changes button
   */
  const [isSlideBeingEdited, setIsSlideBeingEdited] = useState(false);

  // slideBeingEdited becomes true when "Edit" is clicked on carousel slide
  const [slideBeingEdited, setSlideBeingEdited] = useState(false);
  const [initialCarouselState, setInitialCarouselState] = useState([{}]);

  useEffect(() => {
    window.$(function () {
      window.$("body").tooltip({
        selector: '[data-toggle="tooltip"]',
        delay: { show: 0, hide: 100 },
        trigger: "hover",
        animation: true,
      });
    });
    return () => {
      window.$("div[role=tooltip]").remove();
    };
  }, []);

  useLayoutEffect(() => {
    setCarouselData(JSON.parse(props.data.src));
    setInitialCarouselState(JSON.parse(props.data.src));

    return () => {};
  }, [props.data.src, props.data.id]);

  useEffect(() => {
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [arrLength]);

  useEffect(() => {
    if (carouselData) {
      setArrLength(carouselData.length);
    }
  }, [carouselData, elRefs]);

  useEffect(() => {
    if (newlyAdded) {
      elRefs[elRefs.length - 1].current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });

      // TODO: Rewrite with async behaviour once backend route is implemented
      setTimeout(() => {
        setnewlyAdded(false);
      }, 250);
    }

    if (isSlideBeingEdited) {
      let editingRef;

      for (let aRef in elRefs) {
        if (elRefs[aRef] === slideBeingEdited.reactRef) {
          editingRef = elRefs[aRef];
        }
      }

      // TODO: Rewrite with async behaviour once backend route is implemented
      setTimeout(() => {
        editingRef.current.scrollIntoView({
          behavior: "smooth", 
          inline: "center",
        });
      }, 250);
    }
  }, [newlyAdded, elRefs, isSlideBeingEdited, slideBeingEdited.reactRef]);

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const new_items = reorder(
      carouselData,
      result.source.index,
      result.destination.index
    );

    setCarouselData(new_items);
  }

  const addNewImage = function (add_image_slide) {
    setIsCarouselLoading(true);

    // pass true if adding image
    props.addASlideInCarousel(props.data.id, add_image_slide, (err) => {
      if (!err) {
        setIsCarouselLoading(false);
        setnewlyAdded(true);
      }
      // TODO: Handle Error [Show error]
    });
  };

  const updateASlide = function (
    slide_id,
    slide_caption,
    slide_type,
    image_file,
    is_image_url,
    image_src_changed,
    video_src,
    video_src_changed,
    callback
  ) {
    setIsCarouselLoading(true);

    props.updateASlideInCarousel(
      props.data.id,
      slide_id,
      slide_caption,
      slide_type,
      image_file,
      is_image_url,
      image_src_changed,
      video_src,
      video_src_changed,
      (err, erroMesage, newImageSrc, newSlideCaption) => {
        if (!err) {
          setIsCarouselLoading(false);
          callback(newImageSrc, newSlideCaption);
        }
      }
    );
  };

  const deleteASlide = function (id, callback) {
    setIsCarouselLoading(true);

    if (carouselData.length <= 2) {
      setIsCarouselLoading(false);
      callback(false);

      return;
    }

    props.deleteASlideInCarousel(props.data.id, id, (err) => {
      if (!err) {
        setIsCarouselLoading(false);
      }
      // TODO: Handle Error [Show error]
    });
  };

  const popupCancelAndUpdateButtonWrapperStyling = {
    bottom: "6px",
    left: "8px",
    margin: 0,
  };

  return (
    <div
      className={`smoothTransition text-dark whiteBackground position-relative pt-0 ${
        props.popupEditModeSelected ? "position-relative " : " py-1null "
      } ${!readMode ? " popupEditingWidget px-1 highlightedBackground " : null}
          ${highlightedBackground ? " highlightedBackground " : null}`}
      onMouseEnter={(e) => {
        if (!props.popupEditModeSelected) {
          setShowEditButton(true);
          seHighlightedBackground(true);
        }
      }}
      onMouseLeave={(e) => {
        if (!props.popupEditModeSelected) {
          setShowEditButton(false);
          seHighlightedBackground(false);
        }
      }}
      style={!readMode ? { paddingBottom: "40px" } : {}}
    >
      {readMode && showEditButton ? (
        <motion.div
          initial={{ opacity: 0.1, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="position-absolute popupWidget_EditButton"
        >
          <a
            href="#!"
            className="badge badge-info text-white px-0 border rounded position-absolute popupWidget_EditButton"
            id={props.widgetId}
            onClick={(e) => {
              e.preventDefault();
              setReadMode(false);
              props.setPopupWidgetBeingEdited((prevState) => {
                return [...prevState, { id: props.data.id }];
              });
            }}
            aria-disabled="true"
          >
            <i className="text-white px-2 far fa-edit fa-1x"> </i>
          </a>
        </motion.div>
      ) : undefined}

      {!readMode && (
        <div
          className="row position-absolute"
          style={popupCancelAndUpdateButtonWrapperStyling}
        >
          <div className="col pl-0 pr-2 no-gutters">
            <button
              className=" border-0 rounded popupWidget_ExitButton btn-sm btn badge badge-secondary text-white"
              data-toggle="tooltip"
              data-placement="left"
              title="Cancel changes"
              disabled={isSlideBeingEdited}
              onClick={(e) => {
                e.preventDefault();
                window.$("div[role=tooltip]").remove();
                setReadMode(true);
                setShowEditButton(false);
                setCarouselData(initialCarouselState);

                props.setPopupWidgetBeingEdited((prevState) => {
                  return prevState.filter(
                    (marker) => marker.id !== props.data.id
                  );
                });
              }}
              aria-disabled="true"
            >
              <i className="text-white m-auto far fa-times-circle fa-1x"> </i>
            </button>
          </div>
          <div className="col pl-0  no-gutters">
            <button
              className="text-white  border-0 rounded popupWidget_ExitButton btn-sm btn badge badge-success text-white"
              data-toggle="tooltip"
              data-placement="right"
              title="Save changes"
              disabled={isSlideBeingEdited}
              onClick={(e) => {
                // Save carousel images/videos slide order (reorder)md-
                e.preventDefault();

                window.$("div[role=tooltip]").remove();

                let newCarouselData = [];
                var test = carouselData;
                for (var i in test) {
                  carouselData[i].order_no = i;
                  newCarouselData.push(carouselData[i]);
                }
                setReadMode(true);
                setShowEditButton(false);

                props.updateCarouselSlidesOrder(
                  props.data.id,
                  JSON.stringify(newCarouselData),
                  props.data.widget_type_id
                );
                props.setPopupWidgetBeingEdited((prevState) => {
                  return prevState.filter(
                    (marker) => marker.id !== props.data.id
                  );
                });
              }}
            >
              <i className="text-white m-auto far fa-check-circle fa-1x"> </i>
            </button>
          </div>
        </div>
      )}

      <DeleteButton
        deleteAWidget={props.deleteAWidget}
        widgetId={props.data.id}
        popupEditModeSelected={props.popupEditModeSelected}
      ></DeleteButton>

      {carouselData && (
        <React.Fragment>
          {isCarouselLoading && (
            <div
              className="position-absolute h-100 w-100 smoothTransition"
              style={{ background: "#ffffffad", zIndex: "9" }}
            ></div>
          )}
          {isCarouselLoading && (
            <div
              className="position-absolute smoothTransition"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: 10,
              }}
            >
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          <CarouselAddNewSlide
            readMode={readMode}
            addNewImage={addNewImage}
            isSlideBeingEdited={isSlideBeingEdited}
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(
                    snapshot.isDraggingOver,
                    isSlideBeingEdited
                  )}
                  {...provided.droppableProps}
                >
                  {carouselData.length > 0 && (
                    <React.Fragment>
                      {carouselData.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={readMode || isSlideBeingEdited}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                readMode,
                                isSlideBeingEdited
                              )}
                              id={item.id}
                            >
                              <div
                                ref={elRefs[index]}
                                className="position-relative h-100"
                              >
                                {item.slide_type === "image" ? (
                                  <CarouselSlide
                                    slideData={item}
                                    readMode={readMode}
                                    deleteASlide={deleteASlide}
                                    updateASlide={updateASlide}
                                    setIsSlideBeingEdited={
                                      setIsSlideBeingEdited
                                    }
                                    reactRef={elRefs[index]}
                                    setSlideBeingEdited={setSlideBeingEdited}
                                  />
                                ) : (
                                  <CarouselVideoSlide
                                    slideData={item}
                                    readMode={readMode}
                                    deleteASlide={deleteASlide}
                                    updateASlide={updateASlide}
                                    setIsSlideBeingEdited={
                                      setIsSlideBeingEdited
                                    }
                                    reactRef={elRefs[index]}
                                    setSlideBeingEdited={setSlideBeingEdited}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </React.Fragment>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </React.Fragment>
      )}
    </div>
  );
}

export default PopupCarouselWidget;

function CarouselVideoSlide(props) {
  const [slideData, setSlideData] = useState(false);
  const [updatingSlideData, setUpdatingSlideData] = useState(false);

  const [initialVideoUrlBackup, setInitialVideoUrlBackup] = useState("");
  const [initialSlideCaptionBackup, setInitialSlideCaptionBackup] =
    useState("");

  const [imageUrl, setImageUrl] = useState(false);
  const [videoUrl, setVideoUrl] = useState(false);

  const [slideCaption, setSlideCaption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyingVideo, setVerifyingVideo] = useState(false);

  useEffect(() => {
    setSlideData(props.slideData);
    setVideoUrl(props.slideData.src);

    setInitialVideoUrlBackup(props.slideData.src);

    /**
     * Set slide caption and backup caption to revert back when cancel is clicked
     */
    setInitialSlideCaptionBackup(props.slideData.caption);
    setSlideCaption(props.slideData.caption);

    setIsLoading(true);

    return () => {
      setIsLoading(false);
    };
  }, []);

  const onVideoUrlChange = (event) => {
    let newUrl = event.target.value;
    let videoHost = newUrl.split("/")[2];

    // TODO: Create a endpoint in API to validate each video link
    if (videoHost === "vimeo.com") {
      setVideoUrl("https://player.vimeo.com/video/" + newUrl.split("/")[3]);
    } else if (videoHost === "www.youtube.com") {
      setVideoUrl("https://www.youtube.com/embed/" + newUrl.split("?v=")[1]);
    } else {
      setVideoUrl(event.target.value);
    }
  };

  return (
    <React.Fragment>
      {!props.readMode && (
        <React.Fragment>
          <div className="pb-1 text-md-left text-center">
            <div className="row">
              {!updatingSlideData && (
                <React.Fragment>
                  <div className="col-md-6">
                    <button
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-danger text-white"
                      onClick={(e) => {
                        // setIsLoading(true);
                        props.deleteASlide(slideData.id, function (deleted) {
                          if (!deleted) {
                            // setIsLoading(false);
                          }
                        });
                      }}
                      id={slideData.id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="col-md-6 text-md-right text-center">
                    <button
                      id={slideData.id}
                      className="btn-sm smoothTransition btn badge ml-0 badge-pill badge-light text-dark"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                      onClick={(e) => {
                        setUpdatingSlideData(true);
                        props.setIsSlideBeingEdited(true);
                        props.setSlideBeingEdited({
                          id: slideData.id,
                          reactRef: props.reactRef,
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </React.Fragment>
              )}
              {updatingSlideData && (
                <React.Fragment>
                  <div className="col-md-6">
                    <button
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-danger text-white"
                      onClick={(e) => {
                        // setImageLocalUrl(initialImageUrlBackup);
                        setVideoUrl(initialVideoUrlBackup);
                        setSlideCaption(initialSlideCaptionBackup);
                        setUpdatingSlideData(false);
                        props.setIsSlideBeingEdited(false);
                      }}
                      id={slideData.id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="col-md-6 text-md-right text-center">
                    {verifyingVideo && (
                      <div
                        className="spinner-grow text-light spinner-grow-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    <button
                      id={slideData.id}
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-success text-white"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                      onClick={(e) => {
                        props.updateASlide(
                          slideData.id,
                          slideCaption,
                          slideData.slide_type,
                          false,
                          false,
                          false,
                          videoUrl,
                          videoUrl !== initialVideoUrlBackup,
                          (newImageSrc, newSlideCaption) => {
                            setUpdatingSlideData(false);
                            props.setIsSlideBeingEdited(false);
                            setInitialVideoUrlBackup(newImageSrc);
                            setImageUrl(newImageSrc);
                            setInitialSlideCaptionBackup(newSlideCaption);
                            setSlideCaption(newSlideCaption);
                          }
                        );
                      }}
                    >
                      Save
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
          {updatingSlideData && (
            <div className="mb-2 mt-1">
              <div className="input-group flex-nowrap input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fas fa-link"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image url"
                  aria-label="Image url"
                  aria-describedby="addon-wrapping"
                  value={videoUrl}
                  onChange={(e) => onVideoUrlChange(e)}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      )}
      <div
        className="smoothTransition "
        style={
          props.readMode || updatingSlideData
            ? {
                height: "auto",

                minWidth: "300px",
                minHeight: "300px",
              }
            : {
                minWidth: "250px",
                minHeight: "auto",
                marginTop: "0em",
              }
        }
      >
        {videoUrl !== false && (
          <div
            className="video_wrapper_on_drag"
            style={
              props.readMode || updatingSlideData
                ? {}
                : { position: "relative", zIndex: 1 }
            }
          >
            <div className="embed-container">
              <iframe
                width="560"
                height="315"
                className="border-0"
                src={videoUrl}
                style={
                  props.readMode || updatingSlideData ? {} : { zIndex: -1 }
                }
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                title="video_"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

function CarouselSlide(props) {
  const [slideData, setSlideData] = useState(false);
  const [updatingSlideData, setUpdatingSlideData] = useState(false);

  const [initialImageUrlBackup, setInitialImageUrlBackup] = useState("");
  const [initialSlideCaptionBackup, setInitialSlideCaptionBackup] =
    useState("");

  const [imageUrl, setImageUrl] = useState(false);
  const [imageLocalUrl, setImageLocalUrl] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);

  // Is image URl or image uploaded by user
  const [image_url, setImage_url] = useState(false);
  const [slideCaption, setSlideCaption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [verifyingImage, setVerifyingImage] = useState(false);
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });

  const onEditorStateChange = (editorState) => {
    setEditorState({
      value: editorState,
    });

    let newCaption = convertToRaw(editorState.getCurrentContent());
    console.log(newCaption.blocks[0].text);
    setSlideCaption(newCaption.blocks[0].text);
  };

  useEffect(() => {
    setSlideData(props.slideData);
    setImageUrl(props.slideData.src);
    setImageLocalUrl(props.slideData.src);
    setInitialImageUrlBackup(props.slideData.src);

    /**
     *   Set slide caption and backup caption to revert back when cancel is clicked
     */
    setInitialSlideCaptionBackup(props.slideData.caption);
    setSlideCaption(props.slideData.caption);

    setIsLoading(true);

    return () => {
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    var defaultText = {
      blocks: [
        {
          key: "7pjmv",
          text: props.slideData.caption,
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: { "text-align": "center" },
        },
      ],
      entityMap: {},
    };

    setEditorState({
      value: EditorState.createWithContent(convertFromRaw(defaultText)),
    });
  }, []);

  useLayoutEffect(() => {
    if (image_url) {
      let img = new Image();

      img.src = imageUrl;
      setVerifyingImage(true);
      img.onload = function () {
        setVerifyingImage(false);
        setIsImageValid(true);
      };

      img.onerror = function () {
        setVerifyingImage(false);
        setIsImageValid(false);
      };
    } else {
      setIsImageValid(true);
    }

    return () => {
      setVerifyingImage(false);
    };
  }, [imageUrl, image_url]);

  const onImageChange = (event, newImgLink) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      setImageUrl(event.target.files[0]);
      setImage_url(false);
      setImageLocalUrl(String(URL.createObjectURL(img)));
    }

    if (newImgLink) {
      let tempState = slideData;
      tempState.src = event.target.value;

      setSlideData(tempState);
      setImageUrl(event.target.value);
      setImage_url(true);
      setImageLocalUrl(event.target.value);
    }
  };

  return (
    <React.Fragment>
      {!props.readMode && (
        <React.Fragment>
          {isLoading && (
            <div
              className="position-absolute h-100 w-100 smoothTransition"
              style={{ background: "#ffffffad", zIndex: "9" }}
            ></div>
          )}
          <div className="pb-1 text-md-left text-center">
            {isLoading && (
              <div
                className="position-absolute smoothTransition"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  zIndex: 10,
                }}
              >
                <div className="spinner-grow text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}

            <div className="row">
              {!updatingSlideData && (
                <React.Fragment>
                  <div className="col-md-6">
                    <button
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-danger text-white"
                      onClick={(e) => {
                        props.deleteASlide(slideData.id, function (deleted) {
                          if (!deleted) {
                          }
                        });
                      }}
                      id={slideData.id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="col-md-6 text-md-right text-center">
                    <button
                      id={slideData.id}
                      className="btn-sm smoothTransition btn badge ml-0 badge-pill badge-light text-dark"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                      onClick={(e) => {
                        setUpdatingSlideData(true);
                        props.setIsSlideBeingEdited(true);
                        props.setSlideBeingEdited({
                          id: slideData.id,
                          reactRef: props.reactRef,
                        });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </React.Fragment>
              )}
              {updatingSlideData && (
                <React.Fragment>
                  <div className="col-md-6">
                    <button
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-danger text-white"
                      onClick={(e) => {
                        setImageLocalUrl(initialImageUrlBackup);
                        setImageUrl(initialImageUrlBackup);
                        setSlideCaption(initialSlideCaptionBackup);
                        setUpdatingSlideData(false);
                        props.setIsSlideBeingEdited(false);
                      }}
                      id={slideData.id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="col-md-6 text-md-right text-center">
                    {verifyingImage && (
                      <div
                        className="spinner-grow text-light spinner-grow-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    <button
                      id={slideData.id}
                      className="btn-sm btn smoothTransition badge ml-0 badge-pill badge-success text-white"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "30px",
                      }}
                      onClick={(e) => {
                        props.updateASlide(
                          slideData.id,
                          slideCaption,
                          slideData.slide_type,
                          imageUrl,
                          image_url,
                          imageUrl !== initialImageUrlBackup,
                          false,
                          false,
                          (newImageSrc, newSlideCaption) => {
                            setUpdatingSlideData(false);
                            props.setIsSlideBeingEdited(false);
                            setInitialImageUrlBackup(newImageSrc);
                            setImageLocalUrl(newImageSrc);
                            setImageUrl(newImageSrc);

                            setInitialSlideCaptionBackup(newSlideCaption);
                            setSlideCaption(newSlideCaption);
                          }
                        );
                      }}
                      disabled={
                        (imageUrl === initialImageUrlBackup &&
                          slideCaption === initialSlideCaptionBackup) ||
                        isImageValid === false ||
                        verifyingImage
                      }
                    >
                      Save
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
          {updatingSlideData && (
            <div>
              <div className="input-group flex-nowrap input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fas fa-link"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Image url"
                  aria-label="Image url"
                  aria-describedby="addon-wrapping"
                  value={imageUrl}
                  onChange={(e) => onImageChange(e, true)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 9) e.preventDefault();
                  }}
                />
              </div>

              <div className="input-group flex-nowrap input-group-sm my-2 border rounded">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fas fa-upload"></i>
                  </span>
                </div>
                <label className="btn btn-default btn-sm">
                  <input
                    type="file"
                    className="form-control. w-100"
                    placeholder="upload image"
                    aria-label="upload image"
                    accept="image/*"
                    aria-describedby="addon-wrapping"
                    onChange={(e) => onImageChange(e)}
                  />
                </label>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
      {initialImageUrlBackup && (
        <div
          className="smoothTransition"
          style={
            props.readMode || updatingSlideData
              ? {
                  height: "auto",
                  minHeight: "300px",
                }
              : {
                  minHeight: "auto",
                }
          }
        >
          <img
            alt="test"
            src={imageLocalUrl}
            onLoad={() => setIsLoading(false)}
            className={` smoothTransition  ${
              isLoading ? "opacity-0" : "opacity-1 "
            }`}
            style={
              props.readMode || updatingSlideData
                ? {
                    height: "auto",
                    width: "300px",
                    minWidth: "300px",
                  }
                : {
                    height: "auto",
                    width: "180px",
                    minWidth: "180px",
                  }
            }
          />
          {isLoading ? (
            <div
              className="position-absolute smoothTransition"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: 10,
              }}
            >
              <div className="spinner-grow text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div
        className={`video_wrapper_on_drag smoothTransition text-center mt-2  ${
          updatingSlideData ? " bg-white text-black py-2 " : " text-white "
        }  `}
        style={
          props.popupEditModeSelected ? { position: "relative", zIndex: 1 } : {}
        }
      >
        <Editor
          readOnly={!updatingSlideData}
          toolbarHidden={!updatingSlideData}
          handlePastedText={() => false}
          editorState={editorState.value}
          toolbarClassName="bg-info m-0 p-0 border-0"
          wrapperClassName="demo-wrapper m-0 p-0 border-0"
          editorClassName={`demo-editor-custom m-0 p-0 border-0 buttonEditor   ${
            updatingSlideData ? "changeCursor " : " "
          }  `}
          toolbar={{ options: [], inline: { options: [] } }}
          onEditorStateChange={onEditorStateChange}
          onTab={(e) => {
            if (e.keyCode === 9) e.preventDefault();
          }}
        />
      </div>
    </React.Fragment>
  );
}

const DeleteButton = (props) => (
  <React.Fragment>
    {props.popupEditModeSelected && (
      <button
        className="btn-sm btn btn-danger text-white px-0  rounded popupWidget_DeleteButton"
        id={props.widgetId}
        onClick={(e) => props.deleteAWidget(e)}
      >
        <i className="text-white px-2 far fa-trash-alt fa-1x"> </i>
      </button>
    )}
  </React.Fragment>
);

const CarouselAddNewSlide = (props) => (
  <React.Fragment>
    {!props.readMode && (
      <div className="py-2 text-left">
        <div className="row">
          <div className="col-xl-6 text-xl-left text-center">
            <button
              className="btn-sm smoothTransition btn badge ml-0 badge-pill badge-secondary text-white bg-info"
              onClick={(e) => props.addNewImage(true)}
              style={{ padding: "5px 10px", borderRadius: "30px" }}
              disabled={props.isSlideBeingEdited}
            >
              Add Image Slide
            </button>
          </div>

          <div className="col-xl-6 text-xl-right text-center">
            <button
              className="btn-sm smoothTransition btn badge ml-0 badge-pill badge-secondary text-white bg-info"
              onClick={(e) => props.addNewImage(false)}
              style={{ padding: "5px 10px", borderRadius: "30px" }}
              disabled={props.isSlideBeingEdited}
            >
              Add Video Slide
            </button>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
);

// returns Reorder results
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging,
  draggableStyle,
  readMode,
  isSlideBeingEdited
) => ({
  userSelect: "none",
  margin: `0 ${grid}px 0 0`,
  transition: "all 0.65s ease-in-out",
  padding: `${grid}px`,
  background: isDragging ? "lightgreen" : "#19a2b8",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, isSlideBeingEdited) => ({
  background: isDraggingOver ? "lightblue" : "white",
  display: "flex",
  padding: grid,
  overflow: isSlideBeingEdited ? "hidden" : "auto",
});
