import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";

import useQuery from "../../utils/UseQuery";

export default function SearchImages() {
  const query = useQuery();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");

  const current_image_name = query.get("image_name") || "";

  useEffect(() => {
    if (current_image_name !== "") {
      setSearchQuery(current_image_name);
    } else {
      setSearchQuery("");
    }
  }, [current_image_name]);

  const getImagesBySearch = (event: any) => {
    setSearchQuery(event.target.value);
    history.push(`/image?image_name=${event.target.value}`);
  };

  const onSearchInput = (event: any) => {
    setSearchQuery(event.target.value);
  };

  return (
    <form>
      <div className="row my-2">
        <div className="col-12 col-md-6 text-left mr-auto my-auto">
          <div className="input-group input-group-sm ">
            <div className="input-group-prepend">
              <span
                className="input-group-text bg-light text-dark"
                id="inputGroup-sizing-sm"
              >
                <i className="fas fa-search"></i>
              </span>
            </div>
            {/* <input
              type="text"
              className="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              value={searchQuery}
              onChange={onSearchInput}
            /> */}
            <DebounceInput
              minLength={1}
              aria-label="Small"
              value={searchQuery}
              debounceTimeout={300}
              className="form-control"
              onChange={(event) => getImagesBySearch(event)}
            />
          </div>
        </div>
        {/* <div className="col-3 col-md-6 mr-auto my-auto">
           <button
            type="submit"
            className="btn btn-sm btn-info"
            disabled={searchQuery === ""}
            onClick={getImagesBySearch}
          >
            Search
          </button> 
        </div>*/}
      </div>
    </form>
  );
}
