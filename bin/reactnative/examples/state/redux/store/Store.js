/* istanbul ignore file */
import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';

import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootReducer from '../reducers/RootReducer';
import Migrations from './Migrations';

const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}

const persistConfig = {
  key: '{APPNAME}',
  storage: AsyncStorage,
  whitelist: [],
  version: 1,
  migrate: createMigrate(Migrations, {debug: true}),
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const Store = createStore(persistedReducer, applyMiddleware(...middleware));

const Persistor = persistStore(Store);

export {Store, Persistor};
