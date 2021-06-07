import React from "react";

const WidgetWrapper = (props) => (
  <div
    className="col-10s d-flex align-items-center  mx-auto"
    style={props.style}
  >
    {props.children}
  </div>
);

export const HeaderWidget = () => (
  <WidgetWrapper
    style={{
      background: "#44444485",
      borderRadius: "4px",
      padding: "16px",
    }}
  >
    <div>Add Header</div>
  </WidgetWrapper>
);

export const ParagraphWidget = () => (
  <WidgetWrapper
    style={{
      background: "#44444463",
      borderRadius: "4px",
      padding: "12px",
    }}
  >
    <div>Add Text (Copy)</div>
  </WidgetWrapper>
);

export const FreeTextWidget = () => (
  <WidgetWrapper
    style={{
      background: "#0f0f0f63",
      borderRadius: "4px",
      padding: "12px",
    }}
  >
    <div>Add Text (Free Mode)</div>
  </WidgetWrapper>
);

export const ImageWidget = () => (
  <WidgetWrapper
    style={{
      background: "#ffffff57",
      borderRadius: "4px",
      padding: "40px 16px",
      backgroundSize: "cover",
      backgroundPositionY: "-30px",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80')",
    }}
  >
    <div>Add image</div>
  </WidgetWrapper>
);

export const VideoWidget = () => (
  <WidgetWrapper
    style={{
      background: "#ffffff57",
      borderRadius: "4px",
      padding: "40px 16px",
      backgroundSize: "cover",
      backgroundImage:
        "url('https://media3.giphy.com/media/1kkxWqT5nvLXupUTwK/giphy.gif?cid=ecf05e47xuqieva7e9fn36dk27ucx7ccdgdo3l4g94si72xr&rid=giphy.gif')",
    }}
  >
    <div>Add Video</div>
  </WidgetWrapper>
);

export const ButtonWidget = () => (
  <WidgetWrapper
    style={{
      background: "#ffffff57",
      borderRadius: "4px",
      padding: "16px",
    }}
  >
    <div>Add Button</div>
  </WidgetWrapper>
);

export const CarouselWidget = () => (
  <WidgetWrapper
    style={{
      background: "#ffffff57",
      borderRadius: "4px",
      padding: "16px",
    }}
  >
    <div>CarouselWidget</div>
  </WidgetWrapper>
);

export const Widget_ID = {
  HeaderWidget: "widget_id_1",
  ImageWidget: "widget_id_2",
  VideoWidget: "widget_id_3",
  ButtonWidget: "widget_id_4",
  ParagraphWidget: "widget_id_5",
  FreeTextWidget: "widget_id_6",
  CarouselWidget: "widget_id_7",
};

export const Widgets = [
  { id: Widget_ID.HeaderWidget, widget: <HeaderWidget /> },
  { id: Widget_ID.ParagraphWidget, widget: <ParagraphWidget /> },
  // { id: Widget_ID.FreeTextWidget, widget: <FreeTextWidget /> },
  { id: Widget_ID.ImageWidget, widget: <ImageWidget /> },
  { id: Widget_ID.VideoWidget, widget: <VideoWidget /> },
  { id: Widget_ID.ButtonWidget, widget: <ButtonWidget /> },
  { id: Widget_ID.CarouselWidget, widget: <CarouselWidget /> },
];
