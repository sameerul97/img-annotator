import React, { createContext, useReducer, Dispatch } from "react";
import type { ReactNode } from "react";
import EmbedReducer from "./reducers";
import type { InitialStateType } from "./types";
import { Action } from "./actions";

const initialState = {
  popup: null,
  selectedMarker: null,
  selectedPopup: null,
  error: null,
  loading: false
};

const EmbedContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined
});

const EmbedStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(EmbedReducer, initialState);

  return (
    <EmbedContext.Provider value={{ state, dispatch }}>
      {children}
    </EmbedContext.Provider>
  );
};

export { EmbedStoreProvider, EmbedContext };
