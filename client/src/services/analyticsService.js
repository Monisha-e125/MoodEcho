import api from '../api/axios';

const analyticsService = {
  getStats: (days = 30) => api.get('/analytics/stats', { params: { days } }),

  getCalendar: (year, month) =>
    api.get('/analytics/calendar', { params: { year, month } }),

  getWeeklyInsights: () => api.get('/analytics/insights'),

  getExerciseSuggestion: (mood, emotions = []) =>
    api.get('/analytics/suggest-exercise', {
      params: { mood, emotions: emotions.join(',') }
    })
};

export default analyticsService;