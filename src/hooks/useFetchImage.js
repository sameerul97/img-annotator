import { useEffect, useRef, useReducer } from "react";
import { ParseData } from "../utils/ParseImageData";
import API from "../api";

const useFetchImage = (id) => {
  const cache = useRef({});

  const initialState = {
    status: "idle",
    error: null,
    data: [],
    markers: undefined,
    popup_data: undefined,
    image: {},
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, status: "fetching" };

      case "FETCHED":
        return {
          ...initialState,
          status: "fetched",
          data: action.payload.image,
          image: action.payload.image,
          markers: action.payload.marker_positions,
          popup_data: action.payload.popups,
        };

      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };

      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;

    if (!id) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });

      if (cache.current[id]) {
        const data = cache.current[id];
        dispatch({ type: "FETCHED", payload: data });
      } else {
        try {
          const data = await API.get(`/image/`, {
            params: {
              image_id: parseInt(id),
            },
          });
          const [fetchedImage, popupContent] = ParseData(data.data);

          cache.current[id] = data;

          const imageData = {
            data: fetchedImage,
            marker_positions: fetchedImage.marker_positions,
            popups: popupContent,
            image: {
              id: fetchedImage.id,
              name: fetchedImage.name,
              url: fetchedImage.url,
            },
          };

          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: imageData });
        } catch (error) {
          if (cancelRequest) return;
          dispatch({ type: "FETCH_ERROR", payload: error.message });
        }
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [id]);

  return state;
};

export default useFetchImage;
