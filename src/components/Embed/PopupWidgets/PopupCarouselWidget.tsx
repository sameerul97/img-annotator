import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar, A11y } from "swiper";

import "swiper/swiper-bundle.css";
import "swiper/components/effect-fade/effect-fade.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

import { WidgetSrc, CarouselSlide } from "../interfaces";

SwiperCore.use([Navigation, Scrollbar, A11y]);

function PopupCarouselWidget({ src }: WidgetSrc) {
  const [slides, setSlides] = useState<CarouselSlide[]>();

  useEffect(() => {
    setSlides(JSON.parse(src));
  }, [src]);

  if (!slides) {
    return null;
  }

  const LoadSlide = (item: CarouselSlide) => {
    if (item.slide_type === "image") {
      return <ImageSlide src={item.src} />;
    }

    if (item.slide_type === "video") {
      return <VideoSlide src={item.src} />;
    }
  };

  return (
    <Swiper navigation scrollbar={{ draggable: true }}>
      {slides.map((i) => (
        <SwiperSlide key={i.id}>{LoadSlide(i)}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export default PopupCarouselWidget;

const VideoSlide = ({ src }: WidgetSrc) => {
  return (
    <div className="video_wrapper_on_drag position-relative">
      <div className="embed-container">
        <iframe
          width="560"
          height="315"
          className="border-0"
          src={src}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          title="video_"
        />
      </div>
    </div>
  );
};

const ImageSlide = ({ src }: WidgetSrc) => {
  return <img src={src} alt="empty" className="img-fluid" />;
};
