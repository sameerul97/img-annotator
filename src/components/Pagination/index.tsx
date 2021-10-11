import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

interface Post {
  id: number;
  name: String;
  url: string;
}

interface EditorStore {
  auth: {
    authData: null | string;
  };
  posts: {
    images: Post[];
    isLoading: string;
    total_pages: number;
    search: boolean;
    current_page: string;
    search_query: {
      image_name: string;
    };
  };
}

function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const { search, search_query, current_page, images } = useSelector(
    (state: EditorStore) => {
      return state.posts;
    }
  );

  const list = [...Array(totalPages)].map((elementInArray, index) => (
    <li
      key={index + 1}
      className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
    >
      {search && (
        <Link
          to={`/image?page=${index + 1}&image_name=${search_query.image_name}`}
          className="page-link"
        >
          {index + 1}
        </Link>
      )}
      {!search && (
        <Link to={`/image?page=${index + 1}`} className="page-link">
          {index + 1}
        </Link>
      )}
    </li>
  ));

  const prev = (
    <React.Fragment>
      {currentPage !== 1 && (
        <li className="page-item">
          {search && (
            <Link
              to={`/image?page=${currentPage - 1}&image_name=${
                search_query.image_name
              }`}
              className="page-link"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </Link>
          )}

          {!search && (
            <Link
              to={`/image?page=${currentPage - 1}`}
              className="page-link"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </Link>
          )}
        </li>
      )}
    </React.Fragment>
  );

  const next = (
    <React.Fragment>
      {currentPage !== totalPages && (
        <li className="page-item">
          {search && (
            <Link
              to={`/image?page=${currentPage + 1}&image_name=${
                search_query.image_name
              }`}
              className="page-link"
              aria-label="Previous"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </Link>
          )}

          {!search && (
            <Link
              to={`/image?page=${currentPage + 1}`}
              className="page-link"
              aria-label="Previous"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </Link>
          )}
        </li>
      )}
    </React.Fragment>
  );

  return (
    <div className="container text-center">
      <nav aria-label="Page navigation example">
        <ul className="pagination d-inline-flex">
          {prev}
          {list}
          {next}
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
