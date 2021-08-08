import React, { createContext, useReducer } from "react";
import EmbedReducer from "../reducers/EmbedReducer";

const initialState = {
  popup: null,
  selectedMarker: null,
  selectedPopup: null,
  error: null,
  loading: false
};

export const Context = createContext(initialState);

const EmbedStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(EmbedReducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export default EmbedStoreProvider;
