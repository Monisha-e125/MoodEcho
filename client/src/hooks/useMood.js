import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  createMood, fetchHistory, fetchToday,
  clearMoodError, clearCrisisAlert, clearAiInsights
} from '../store/slices/moodSlice';

const useMood = () => {
  const dispatch = useDispatch();
  const mood = useSelector((s) => s.mood);

  return {
    ...mood,
    logMood: useCallback((d) => dispatch(createMood(d)), [dispatch]),
    getHistory: useCallback((p) => dispatch(fetchHistory(p)), [dispatch]),
    getToday: useCallback(() => dispatch(fetchToday()), [dispatch]),
    clearError: useCallback(() => dispatch(clearMoodError()), [dispatch]),
    clearCrisis: useCallback(() => dispatch(clearCrisisAlert()), [dispatch]),
    clearInsights: useCallback(() => dispatch(clearAiInsights()), [dispatch])
  };
};

export default useMood;