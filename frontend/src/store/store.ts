import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userLoginSlice.ts";
import formReducer from "./slices/formSlice";
import userProfileSlice from "./slices/profileSlice.ts";

export const rootReducer = combineReducers({
  login: userReducer,
  form: formReducer,
  profile: userProfileSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;