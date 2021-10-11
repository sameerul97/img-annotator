import { useEffect, useRef, useReducer } from "react";
import { ParseData } from "../utils/ParseImageData";
import API from "../api/index.js";

const useFetchImage = (id: string) => {
  const cache = useRef<any>({});

  const initialState = {
    status: "idle",
    error: null,
    data: [],
    markers: undefined,
    popup_data: undefined,
    image: {},
    details: { header: "", copy: "", script: "" },
  };

  const [state, dispatch] = useReducer((state: any, action: any) => {
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
          details: action.payload.details,
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
          const data = await API.get(`/image/index.php`, {
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
            details: {
              header: data.data[0]["page_header"],
              copy: data.data[0]["page_copy"],
              script: data.data[0]["page_script"],
            },
          };

          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: imageData });
        } catch (error: any) {
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
