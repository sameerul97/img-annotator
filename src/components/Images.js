import React, { useState, useEffect } from "react";
import { HashRouter, Link } from "react-router-dom";
import { HeaderWidget, ImageWidget, ButtonWidget } from "./Widgets";
import { VideoWidget, Widget_ID } from "./Widgets";
import API from "../api";

function AnImage({ img, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {imageLoaded ? null : (
        <div
          className="text-center w-100 d-flex shine"
          style={{ minHeight: "250px" }}
        ></div>
      )}
      <img
        style={imageLoaded ? {} : { display: "none" }}
        src={img.url}
        onLoad={() => setImageLoaded(true)}
        alt="empty"
        className="card-img img-fluid shadow "
      />
      <div
        className="text-left "
        style={{
          bottom: "0",
          width: "100%",
          borderTopRightRadius: " 2px",
          color: "black",
          marginTop: "5px",
        }}
      >
        <p
          className={` ${imageLoaded ? null : "shine"} w-100 `}
          style={imageLoaded ? {} : { minHeight: "30px" }}
        >
          {imageLoaded ? img.name : " "}
        </p>
      </div>
    </div>
  );
}

function Images() {
  const [error, setError] = useState(false);
  const [images, setImages] = useState([
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1441984536979-3513fd89f0d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
    },
  ]);

  const handleScrollPosition = () => {
    const scrollPosition = localStorage.getItem("scrollPosition");

    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      localStorage.removeItem("scrollPosition");
    }
  };

  const handleClick = (e) => {
    localStorage.setItem("scrollPosition", window.pageYOffset);
  };

  useEffect(() => {
    const fetchAllImage = async () => {
      var allImages = await await API.get(`/allimages/`, {
        params: {},
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      return allImages;
    };

    fetchAllImage()
      .then((res) => {
        if (res.data.length > 0) {
          setImages(res.data);
          handleScrollPosition();
        }
      })
      .catch((e) => {
        setError(true);
      });
  }, []);

  const [widgets, setWidgets] = useState([
    { id: "widget_id_1", widgetId: 0, widget: <HeaderWidget /> },
    { id: "widget_id_2", widgetId: 1, widget: <ImageWidget /> },
    { id: "widget_id_3", widgetId: 2, widget: <VideoWidget /> },
    { id: "widget_id_4", widgetId: 3, widget: <ButtonWidget /> },
  ]);

  return (
    <div className="container my-5 ">
      <div className="card-columns text-center text-white">
        {!error && (
          <React.Fragment>
            {images.map((image, index) => (
              <div key={image.id} className="card border-0 py-2">
                <HashRouter>
                  <Link to={`/image/${image.id}`} onClick={handleClick}>
                    <AnImage img={image}></AnImage>
                  </Link>
                </HashRouter>
              </div>
            ))}
          </React.Fragment>
        )}
      </div>
      {error && (
        <div className="w-50 alert alert-danger" role="alert">
          Error, unable to load images
        </div>
      )}
    </div>
  );
}

export default Images;
