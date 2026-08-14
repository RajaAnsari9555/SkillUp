import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "notes",
  initialState: { notes: [], myNotes: [] },
  reducers: {
    setNotes:    (state, action) => { state.notes   = action.payload; },
    setMyNotes:  (state, action) => { state.myNotes = action.payload; },
    addNote:     (state, action) => {
      state.notes.unshift(action.payload);
      state.myNotes.unshift(action.payload);
    },
    removeNote:  (state, action) => {
      state.notes   = state.notes.filter(n => n._id !== action.payload);
      state.myNotes = state.myNotes.filter(n => n._id !== action.payload);
    },
    bumpDownload:(state, action) => {
      const n = state.notes.find(n => n._id === action.payload);
      if (n) n.downloads += 1;
    },
  },
});

export const { setNotes, setMyNotes, addNote, removeNote, bumpDownload } = noteSlice.actions;
export default noteSlice.reducer;
