import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [], // Array of {id, file, url, duration, thumbnail}
  currentTime: 0,
  scenes: [], // Array of {id, startTime, endTime, thumbnail}
  isPlaying: false,
  activeVideoId: null, // Track which video is currently active
  totalDuration: 0, // Total duration of all videos
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    addVideo: (state, action) => {
      const newVideo = action.payload;
      state.videos.push(newVideo);

      // Set as active if it's the first video
      if (state.videos.length === 1) {
        state.activeVideoId = newVideo.id;
      }

      // Update total duration
      state.totalDuration = state.videos.reduce(
        (total, video) => total + video.duration,
        0
      );
    },
    removeVideo: (state, action) => {
      const idToRemove = action.payload;
      state.videos = state.videos.filter((video) => video.id !== idToRemove);

      // Update active video if needed
      if (state.activeVideoId === idToRemove) {
        state.activeVideoId =
          state.videos.length > 0 ? state.videos[0].id : null;
      }

      // Update total duration
      state.totalDuration = state.videos.reduce(
        (total, video) => total + video.duration,
        0
      );
    },
    reorderVideos: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const result = Array.from(state.videos);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      state.videos = result;

      // Update active video if it was moved
      if (state.activeVideoId === removed.id) {
        state.activeVideoId = removed.id; // Still the same video, just position changed
      }
    },
    setActiveVideo: (state, action) => {
      state.activeVideoId = action.payload;
    },
    setDuration: (state, action) => {
      const { id, duration } = action.payload;
      const video = state.videos.find((v) => v.id === id);
      if (video) {
        video.duration = duration;
        // Update total duration
        state.totalDuration = state.videos.reduce(
          (total, video) => total + video.duration,
          0
        );
      }
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    addScene: (state, action) => {
      state.scenes.push(action.payload);
    },
    removeScene: (state, action) => {
      state.scenes = state.scenes.filter(
        (scene) => scene.id !== action.payload
      );
    },
    reorderScenes: (state, action) => {
      // action.payload is the new order of scene IDs
      const newOrder = action.payload;
      state.scenes = newOrder.map((id) =>
        state.scenes.find((scene) => scene.id === id)
      );
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    updateVideoTrim: (state, action) => {
      const { id, startTime, endTime } = action.payload;
      const video = state.videos.find((v) => v.id === id);
      if (video) {
        video.startTime = startTime;
        video.endTime = endTime;
      }
    },
  },
});

export const {
  addVideo,
  removeVideo,
  reorderVideos,
  setActiveVideo,
  setDuration,
  setCurrentTime,
  addScene,
  removeScene,
  reorderScenes,
  setIsPlaying,
  updateVideoTrim,
} = videoSlice.actions;

export default videoSlice.reducer;
