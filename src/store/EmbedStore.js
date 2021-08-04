import React, { createContext, useReducer } from 'react'
import EmbedReducer from '../reducers/EmbedReducer';

const initialState = {
  popup: [],
  selectedMarker:null,
  selectedPopup: null,
  error: null,
  loading:false
}

const EmbedStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(EmbedReducer, initialState)
  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export const Context = createContext(initialState)
export default EmbedStoreProvider
