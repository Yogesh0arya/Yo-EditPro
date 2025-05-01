import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  audioTracks: [], // Array of {id, source, startTime, endTime, volume}
  backgroundMusic: null,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addAudioTrack: (state, action) => {
      state.audioTracks.push(action.payload);
    },
    removeAudioTrack: (state, action) => {
      state.audioTracks = state.audioTracks.filter(
        (track) => track.id !== action.payload
      );
    },
    updateAudioTrack: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.audioTracks.findIndex((track) => track.id === id);
      if (index !== -1) {
        state.audioTracks[index] = { ...state.audioTracks[index], ...updates };
      }
    },
    setBackgroundMusic: (state, action) => {
      state.backgroundMusic = action.payload;
    },
  },
});

export const {
  addAudioTrack,
  removeAudioTrack,
  updateAudioTrack,
  setBackgroundMusic,
} = audioSlice.actions;

export default audioSlice.reducer;
