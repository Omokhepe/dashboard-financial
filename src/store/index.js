import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from './storage';
import budgetReducer from './reducer/budgetReducers';
import potReducer from './reducer/potReduceer';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: storage,
};

const rootReducer = combineReducers({
  budget: budgetReducer,
  pots: potReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
