import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moodService from '../../services/moodService';

export const createMood = createAsyncThunk(
  'mood/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await moodService.create(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to log mood');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'mood/fetchHistory',
  async (params, { rejectWithValue }) => {
    try {
      const res = await moodService.getHistory(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const fetchToday = createAsyncThunk(
  'mood/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const res = await moodService.getToday();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [],
    todayEntries: [],
    latestEntry: null,
    aiInsights: null,
    crisisAlert: null,
    pagination: null,
    isLoading: false,
    isSubmitting: false,
    error: null
  },
  reducers: {
    clearMoodError: (s) => { s.error = null; },
    clearCrisisAlert: (s) => { s.crisisAlert = null; },
    clearAiInsights: (s) => { s.aiInsights = null; }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createMood.pending, (s) => { s.isSubmitting = true; s.error = null; })
      .addCase(createMood.fulfilled, (s, a) => {
        s.isSubmitting = false;
        s.latestEntry = a.payload.entry;
        s.aiInsights = a.payload.aiInsights;
        s.crisisAlert = a.payload.crisis;
        s.todayEntries.unshift(a.payload.entry);
      })
      .addCase(createMood.rejected, (s, a) => {
        s.isSubmitting = false;
        s.error = a.payload;
      })
      // History
      .addCase(fetchHistory.pending, (s) => { s.isLoading = true; })
      .addCase(fetchHistory.fulfilled, (s, a) => {
        s.isLoading = false;
        s.entries = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchHistory.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload;
      })
      // Today
      .addCase(fetchToday.fulfilled, (s, a) => {
        s.todayEntries = a.payload;
      });
  }
});

export const { clearMoodError, clearCrisisAlert, clearAiInsights } = moodSlice.actions;
export default moodSlice.reducer;