import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subtitles: [], // Array of {id, text, startTime, endTime, style}
  images: [], // Array of {id, imageURL, position, size, style}
  textOverlays: [], // Array of {id, text, position, style}
};

const overlaysSlice = createSlice({
  name: "overlays",
  initialState,
  reducers: {
    addSubtitle: (state, action) => {
      state.subtitles.push(action.payload);
    },
    removeSubtitle: (state, action) => {
      state.subtitles = state.subtitles.filter(
        (subtitle) => subtitle.id !== action.payload
      );
    },
    updateSubtitle: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.subtitles.findIndex((subtitle) => subtitle.id === id);
      if (index !== -1) {
        state.subtitles[index] = { ...state.subtitles[index], ...updates };
      }
    },
    addImage: (state, action) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(
        (image) => image.id !== action.payload
      );
    },
    updateImage: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.images.findIndex((image) => image.id === id);
      if (index !== -1) {
        state.images[index] = { ...state.images[index], ...updates };
      }
    },
    addTextOverlay: (state, action) => {
      state.textOverlays.push(action.payload);
    },
    removeTextOverlay: (state, action) => {
      state.textOverlays = state.textOverlays.filter(
        (overlay) => overlay.id !== action.payload
      );
    },
    updateTextOverlay: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.textOverlays.findIndex(
        (overlay) => overlay.id === id
      );
      if (index !== -1) {
        state.textOverlays[index] = {
          ...state.textOverlays[index],
          ...updates,
        };
      }
    },
  },
});

export const {
  addSubtitle,
  removeSubtitle,
  updateSubtitle,
  addImage,
  removeImage,
  updateImage,
  addTextOverlay,
  removeTextOverlay,
  updateTextOverlay,
} = overlaysSlice.actions;

export default overlaysSlice.reducer;
