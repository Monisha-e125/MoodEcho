import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return { user, accessToken };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return { user, accessToken };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch {
    // ignore
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      return res.data.data;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setInitialized: (state) => { state.isInitialized = true; },
    updateUser: (state, action) => { state.user = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
        s.isInitialized = true;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload;
        s.isInitialized = true;
      })
      // Login
      .addCase(loginUser.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
        s.isInitialized = true;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload;
        s.isInitialized = true;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.isAuthenticated = false;
        s.isInitialized = true;
      })
      // GetMe
      .addCase(getMe.pending, (s) => { s.isLoading = true; })
      .addCase(getMe.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload;
        s.isAuthenticated = true;
        s.isInitialized = true;
      })
      .addCase(getMe.rejected, (s) => {
        s.isLoading = false;
        s.user = null;
        s.isAuthenticated = false;
        s.isInitialized = true;
      });
  }
});

export const { clearError, setInitialized, updateUser } = authSlice.actions;
export default authSlice.reducer;