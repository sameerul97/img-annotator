import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { HashRouter, Link } from "react-router-dom";

import useQuery from "../../utils/UseQuery";
import {
  getAllImages,
  fetchImagesBySearch,
  ViewAllImages,
} from "../../store/All_Images/actions-creators";

import { Image, EditorStore } from "../../interfaces/index";
import Pagination from "../Pagination";
import Loading from "../Loading";

function Images() {
  const { total_pages, images, isLoading } = useSelector(
    (state: EditorStore) => {
      return state.posts;
    }
  );

  const query = useQuery();
  const current_page = Number(query.get("page") || 1);
  const current_image_name = query.get("image_name") || "";

  const dispatch = useDispatch();

  useEffect(() => {
    if (current_image_name.length > 0) {
      dispatch(fetchImagesBySearch(current_page, current_image_name));
      dispatch(getAllImages(current_page, current_image_name));
    } else {
      dispatch(ViewAllImages());
      dispatch(getAllImages(current_page));
    }
  }, [current_image_name, dispatch, current_page]);

  if (isLoading) {
    return <Loading />;
  }

  if (images.length === 0) {
    return <p>No Images</p>;
  }

  const handleClick = (e: any) => {
    localStorage.setItem("scrollPosition", String(window.pageYOffset));
  };

  return (
    <React.Fragment>
      <div className="card-columns text-white mb-3 min-vh-75">
        {images.map((img: Image) => (
          <div key={img.id} className="card border-0 py-2">
            <HashRouter>
              <Link to={`/image/${img.id}`} onClick={handleClick}>
                <AnImage img={img}></AnImage>
              </Link>
            </HashRouter>
          </div>
        ))}
      </div>

      <Pagination totalPages={total_pages} currentPage={current_page} />
    </React.Fragment>
  );
}

function AnImage({ img }: { img: Image }) {
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
export default Images;
