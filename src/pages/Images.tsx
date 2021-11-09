import React from "react";
import store from "../store/state/";
import { Provider } from "react-redux";
import Images from "../components/Images/";
import SearchImages from "../components/SearchImages";

export default function ImagesPage() {
  return (
    <Provider store={store}>
      <div className="container py-4">
        <SearchImages />
        <Images />
      </div>
    </Provider>
  );
}
