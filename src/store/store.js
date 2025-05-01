// app/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./videoSlice";
import audioReducer from "./audioSlice";
import overlaysReducer from "./overlaysSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    audio: audioReducer,
    overlays: overlaysReducer,
  },
});
