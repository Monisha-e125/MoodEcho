import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser, registerUser, logoutUser, getMe, clearError
} from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    error: auth.error,
    login: useCallback((d) => dispatch(loginUser(d)), [dispatch]),
    register: useCallback((d) => dispatch(registerUser(d)), [dispatch]),
    logout: useCallback(() => dispatch(logoutUser()), [dispatch]),
    fetchProfile: useCallback(() => dispatch(getMe()), [dispatch]),
    clearAuthError: useCallback(() => dispatch(clearError()), [dispatch])
  };
};

export default useAuth;