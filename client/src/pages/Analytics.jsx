import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Brain, Calendar } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

const cardStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '20px',
  padding: '28px',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px' }}>
      <p style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(label).toLocaleDateString()}</p>
      <p style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>Mood: {payload[0].value}/5</p>
    </div>
  );
};

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
    } catch { /* ignore */ }
    setInsightsLoading(false);
  };

  if (loading) return <Loader text="Loading analytics..." />;

  if (!stats || stats.totalEntries === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📊</span>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>No data yet</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Start logging moods to see your analytics!</p>
      </div>
    );
  }

  const trendIcon = stats.moodTrend === 'improving'
    ? <TrendingUp size={16} style={{ color: '#34d399' }} />
    : stats.moodTrend === 'declining'
      ? <TrendingDown size={16} style={{ color: '#f87171' }} />
      : <Minus size={16} style={{ color: '#94a3b8' }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Analytics</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '15px' }}>Your mood patterns & insights</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: days === d ? '#4f46e5' : '#1e293b',
                color: days === d ? '#fff' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <StatBox label="Total Entries" value={stats.totalEntries} />
        <StatBox label="Average Mood" value={`${stats.averageMood}/5`} />
        <StatBox label="Trend" value={stats.moodTrend} extra={trendIcon} />
        <StatBox label="Period" value={stats.period} />
      </div>

      {/* Mood Chart */}
      {stats.dailyAverage?.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: '#818cf8' }} />
            Mood Over Time
          </h2>
          <div style={{ height: '280px' }}>
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
                  stroke="#334155" fontSize={11} tickLine={false} axisLine={false}
                />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#334155" fontSize={11} tickLine={false} axisLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="average" stroke="#6366f1" fill="url(#moodGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weekday Pattern */}
      {stats.weekdayPattern?.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '24px' }}>
            Weekday Patterns
          </h2>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekdayPattern}>
                <XAxis dataKey="day" stroke="#334155" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke="#334155" fontSize={11} tickLine={false} axisLine={false} width={25} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px' }} />
                <Bar dataKey="average" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Emotions & Triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <ListCard title="Top Emotions" items={stats.topEmotions} itemKey="emotion" color="#818cf8" />
        <ListCard title="Top Triggers" items={stats.topTriggers} itemKey="trigger" color="#fbbf24" />
      </div>

      {/* AI Insights */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={20} style={{ color: '#818cf8' }} />
            AI Weekly Insights
          </h2>
          <Button variant="secondary" size="sm" onClick={loadInsights} isLoading={insightsLoading}>
            {insights ? 'Refresh' : 'Generate'}
          </Button>
        </div>

        {insights ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>{insights.summary}</p>
            {insights.positiveNote && (
              <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '14px' }}>
                <p style={{ color: '#86efac', fontSize: '14px' }}>💚 {insights.positiveNote}</p>
              </div>
            )}
            {insights.recommendations?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '10px' }}>Recommendations</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {insights.recommendations.map((r, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#94a3b8', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#818cf8' }}>•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Click &ldquo;Generate&rdquo; to get AI-powered insights about your week.
          </p>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, extra }) => (
  <div style={{
    backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '22px',
  }}>
    <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
      <p style={{ fontSize: '20px', fontWeight: '800', color: '#f1f5f9', textTransform: 'capitalize' }}>{value}</p>
      {extra}
    </div>
  </div>
);

const ListCard = ({ title, items, itemKey, color }) => (
  <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px' }}>{title}</h3>
    {items?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item) => {
          const maxCount = items[0]?.count || 1;
          const width = Math.max((item.count / maxCount) * 100, 15);
          return (
            <div key={item[itemKey]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '14px', textTransform: 'capitalize' }}>{item[itemKey]}</span>
                <span style={{ color, fontSize: '14px', fontWeight: '600' }}>{item.count}x</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px' }}>
                <div style={{ width: `${width}%`, height: '6px', backgroundColor: color, borderRadius: '3px', transition: 'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p style={{ color: '#64748b', fontSize: '14px' }}>No data yet</p>
    )}
  </div>
);

export default Analytics;