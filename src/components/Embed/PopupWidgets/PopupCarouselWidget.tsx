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

  const LoadSlide = (slide: CarouselSlide) => {
    if (slide.slide_type === "image") {
      return <ImageSlide slide={slide} />;
    }

    if (slide.slide_type === "video") {
      return <VideoSlide slide={slide} />;
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

const VideoSlide = ({ slide }: { slide: CarouselSlide }) => {
  return (
    <div className="embed-container">
      <iframe
        width="560"
        height="315"
        className="border-0"
        src={slide.src}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        title="video_"
      />
    </div>
  );
};

const ImageSlide = ({ slide }: { slide: CarouselSlide }) => {
  return (
    <React.Fragment>
      <div className="pb-3">
        <img src={slide.src} alt="empty" className="img-fluid" />
        <SlideCaption caption={slide.caption} />
      </div>
    </React.Fragment>
  );
};

const SlideCaption = ({ caption }: { caption: string }) => <p>{caption}</p>;
