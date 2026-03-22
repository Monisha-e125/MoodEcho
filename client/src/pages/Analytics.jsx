import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Brain, Calendar } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    analyticsService.getStats(days)
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const loadInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await analyticsService.getWeeklyInsights();
      setInsights(res.data.data);
    } catch {
      // ignore
    }
    setInsightsLoading(false);
  };

  if (loading) return <Loader text="Loading analytics..." />;
  if (!stats) return <p className="text-dark-400 text-center py-12">No data yet. Start logging moods!</p>;

  const trendIcon = stats.moodTrend === 'improving'
    ? <TrendingUp className="w-4 h-4 text-green-400" />
    : stats.moodTrend === 'declining'
      ? <TrendingDown className="w-4 h-4 text-red-400" />
      : <Minus className="w-4 h-4 text-dark-400" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-dark-400 mt-1">Your mood patterns & insights</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                days === d
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Total Entries" value={stats.totalEntries} />
        <StatBox label="Average Mood" value={`${stats.averageMood}/5`} />
        <StatBox label="Trend" value={stats.moodTrend} extra={trendIcon} />
        <StatBox label="Period" value={stats.period} />
      </div>

      {/* Mood Chart */}
      {stats.dailyAverage?.length > 0 && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            <Calendar className="w-5 h-5 inline mr-2 text-primary-400" />
            Mood Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyAverage}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  stroke="#475569" fontSize={12}
                />
                <YAxis domain={[1, 5]} stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
                  labelFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <Area type="monotone" dataKey="average" stroke="#6366f1" fill="url(#moodGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weekday Pattern */}
      {stats.weekdayPattern?.length > 0 && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Weekday Patterns</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekdayPattern}>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
                />
                <Bar dataKey="average" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Emotions & Triggers */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Top Emotions</h2>
          {stats.topEmotions?.length > 0 ? (
            <div className="space-y-2">
              {stats.topEmotions.map(({ emotion, count }) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-dark-300 capitalize">{emotion}</span>
                  <span className="text-primary-400 font-medium">{count}x</span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-500 text-sm">No data yet</p>}
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Top Triggers</h2>
          {stats.topTriggers?.length > 0 ? (
            <div className="space-y-2">
              {stats.topTriggers.map(({ trigger, count }) => (
                <div key={trigger} className="flex items-center justify-between">
                  <span className="text-dark-300 capitalize">{trigger}</span>
                  <span className="text-amber-400 font-medium">{count}x</span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-500 text-sm">No data yet</p>}
        </div>
      </div>

      {/* AI Weekly Insights */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            <Brain className="w-5 h-5 inline mr-2 text-primary-400" />
            AI Weekly Insights
          </h2>
          <Button variant="secondary" size="sm" onClick={loadInsights} isLoading={insightsLoading}>
            Generate
          </Button>
        </div>

        {insights ? (
          <div className="space-y-3">
            <p className="text-dark-300">{insights.summary}</p>
            {insights.positiveNote && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-300 text-sm">💚 {insights.positiveNote}</p>
              </div>
            )}
            {insights.recommendations?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {insights.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-dark-400 flex items-start gap-2">
                      <span className="text-primary-400">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-dark-500 text-sm">Click &ldquo;Generate&rdquo; to get AI-powered insights about your week.</p>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, extra }) => (
  <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
    <p className="text-xs text-dark-500 mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <p className="text-lg font-bold text-white capitalize">{value}</p>
      {extra}
    </div>
  </div>
);

export default Analytics;