import React from "react";
import EditorStore from "../store/All_Images";
import { Provider } from "react-redux";
import Images from "../components/Images/";
import SearchImages from "../components/SearchImages";

export default function ImagesPage() {
  return (
    <Provider store={EditorStore}>
      <div className="container py-4">
        <SearchImages />
        <Images />
      </div>
    </Provider>
  );
}
