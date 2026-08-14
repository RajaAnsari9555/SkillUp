import { createSlice } from "@reduxjs/toolkit";

const systemDesignSlice = createSlice({
  name: "systemDesign",
  initialState: {
    videos: [],
    myVideos: [],
  },
  reducers: {
    setVideos:   (state, action) => { state.videos   = action.payload; },
    setMyVideos: (state, action) => { state.myVideos = action.payload; },
    removeVideo: (state, action) => {
      state.videos   = state.videos.filter(v => v._id !== action.payload);
      state.myVideos = state.myVideos.filter(v => v._id !== action.payload);
    },
    addVideo: (state, action) => {
      state.myVideos.unshift(action.payload);
      state.videos.unshift(action.payload);
    },
  },
});

export const { setVideos, setMyVideos, removeVideo, addVideo } = systemDesignSlice.actions;
export default systemDesignSlice.reducer;
