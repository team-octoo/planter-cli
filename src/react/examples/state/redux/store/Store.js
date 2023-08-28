import {configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import RootReducer from "../reducers/RootReducer";
import {persistReducer, persistStore} from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  version: 1,
  whitelist: [],
  storage,
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

let middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  const {logger} = require(`redux-logger`);
  middleware.push(logger);
}

const Store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: middleware,
});

let Persistor = persistStore(Store);

export {Store, Persistor};
