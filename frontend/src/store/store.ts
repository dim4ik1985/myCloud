import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userLoginSlice.ts";
import formReducer from "./slices/formSlice";
import userProfileSlice from "./slices/profileSlice.ts";
import adminPanelSlice from "./slices/AdminSlice.ts";
import filesReducer from "./slices/filesSlice.ts";

export const rootReducer = combineReducers({
  login: userReducer,
  form: formReducer,
  profile: userProfileSlice,
  admin: adminPanelSlice,
  files: filesReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
