import { useEffect, useState, useRef, useCallback } from "react";

const useGetImageNaturalData = () => {
  const [loaded, setLoaded] = useState(false);
  const [imageHeight, setImageHeight] = useState(false);
  const [imageWidth, setImageWidth] = useState(false);
  const [naturalImageHeight, setNaturalImageHeight] = useState(false);
  const [naturalImageWidth, setNaturalImageWidth] = useState(false);
  const ref = useRef(null);

  const handleWindowSizeChange = () => {
    setImageWidth(ref.current.width);
    setImageHeight(ref.current.height);
  };

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, [loaded]);

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad();
      setNaturalImageWidth(ref.current.naturalWidth);
      setNaturalImageHeight(ref.current.naturalHeight);
      setImageWidth(ref.current.width);
      setImageHeight(ref.current.height);

      window.addEventListener("resize", handleWindowSizeChange);
    }

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [
    onLoad,
    setNaturalImageWidth,
    setNaturalImageHeight,
    setImageWidth,
    setImageHeight,
  ]);

  return [
    ref,
    loaded,
    onLoad,
    naturalImageHeight,
    naturalImageWidth,
    imageWidth,
    imageHeight,
  ];
};

export default useGetImageNaturalData;
