import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BookOpen, BarChart3, Sparkles, TrendingUp,
  Clock, Flame, Plus, ArrowRight
} from 'lucide-react';
import useMood from '../hooks/useMood';
import Button from '../components/common/Button';
import analyticsService from '../services/analyticsService';

const moodEmojis = ['😢', '😔', '😐', '🙂', '😄'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { todayEntries, getToday } = useMood();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getToday();
    analyticsService.getStats(7)
      .then((res) => setStats(res.data.data))
      .catch(() => {});
  }, [getToday]);

  const todayLogged = todayEntries.length > 0;
  const latestMood = todayEntries[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px',
          padding: '32px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
          {todayLogged
            ? `You've logged ${todayEntries.length} mood ${todayEntries.length === 1 ? 'entry' : 'entries'} today.`
            : "You haven't logged your mood today. How are you feeling?"}
        </p>
        {!todayLogged && (
          <div style={{ marginTop: '20px' }}>
            <Button onClick={() => navigate('/journal')}>
              <Plus size={16} /> Log Your Mood
            </Button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          icon={
            <span style={{ fontSize: '24px' }}>
              {latestMood ? moodEmojis[latestMood.moodScore - 1] : '📝'}
            </span>
          }
          label="Current Mood"
          value={latestMood ? latestMood.moodLabel : 'Not logged'}
        />
        <StatCard
          icon={<Flame size={22} style={{ color: '#fb923c' }} />}
          label="Streak"
          value={`${user?.moodStreak?.current || 0} days`}
        />
        <StatCard
          icon={<TrendingUp size={22} style={{ color: '#34d399' }} />}
          label="Avg Mood (7d)"
          value={stats?.averageMood ? `${stats.averageMood}/5` : '—'}
        />
        <StatCard
          icon={<Clock size={22} style={{ color: '#60a5fa' }} />}
          label="Total Entries"
          value={stats?.totalEntries || 0}
        />
      </div>

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '20px',
            padding: '28px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px' }}>
            Today&apos;s Entries
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayEntries.map((entry) => (
              <div
                key={entry._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  border: '1px solid #334155',
                }}
              >
                <span style={{ fontSize: '28px' }}>
                  {moodEmojis[entry.moodScore - 1]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '15px' }}>
                    {entry.moodLabel}
                  </p>
                  {entry.journalEntry && (
                    <p
                      style={{
                        color: '#94a3b8',
                        fontSize: '13px',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.journalEntry}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <QuickAction
          icon={<BookOpen size={22} />}
          title="Log Mood"
          desc="Record how you're feeling right now"
          onClick={() => navigate('/journal')}
        />
        <QuickAction
          icon={<BarChart3 size={22} />}
          title="View Analytics"
          desc="Discover your mood patterns"
          onClick={() => navigate('/analytics')}
        />
        <QuickAction
          icon={<Sparkles size={22} />}
          title="Wellness Exercise"
          desc="Try a calming activity"
          onClick={() => navigate('/wellness')}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div
    style={{
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.2s',
    }}
  >
    <div style={{ marginBottom: '12px' }}>{icon}</div>
    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </p>
    <p style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginTop: '4px' }}>
      {value}
    </p>
  </div>
);

const QuickAction = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#1e293b';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: 'rgba(99,102,241,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#818cf8',
        marginBottom: '12px',
      }}
    >
      {icon}
    </div>
    <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '15px' }}>{title}</h3>
    <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{desc}</p>
    <ArrowRight size={16} style={{ color: '#475569', marginTop: '8px' }} />
  </button>
);

export default Dashboard;