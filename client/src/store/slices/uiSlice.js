import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    showCrisisBanner: false,
    crisisData: null
  },
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen: (s, a) => { s.sidebarOpen = a.payload; },
    showCrisis: (s, a) => {
      s.showCrisisBanner = true;
      s.crisisData = a.payload;
    },
    hideCrisis: (s) => {
      s.showCrisisBanner = false;
      s.crisisData = null;
    }
  }
});

export const { toggleSidebar, setSidebarOpen, showCrisis, hideCrisis } = uiSlice.actions;
export default uiSlice.reducer;