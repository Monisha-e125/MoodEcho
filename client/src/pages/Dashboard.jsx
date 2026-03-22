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
const moodColors = ['bg-mood-1', 'bg-mood-2', 'bg-mood-3', 'bg-mood-4', 'bg-mood-5'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { todayEntries, getToday } = useMood();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getToday();
    analyticsService.getStats(7).then((res) => setStats(res.data.data)).catch(() => {});
  }, [getToday]);

  const todayLogged = todayEntries.length > 0;
  const latestMood = todayEntries[0];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-dark-300">
          {todayLogged
            ? `You've logged ${todayEntries.length} mood ${todayEntries.length === 1 ? 'entry' : 'entries'} today.`
            : "You haven't logged your mood today. How are you feeling?"
          }
        </p>

        {!todayLogged && (
          <Button className="mt-4" onClick={() => navigate('/journal')}>
            <Plus className="w-4 h-4" /> Log Your Mood
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<span className="text-xl">{latestMood ? moodEmojis[latestMood.moodScore - 1] : '📝'}</span>}
          label="Current Mood"
          value={latestMood ? latestMood.moodLabel : 'Not logged'}
          color="primary"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          label="Streak"
          value={`${user?.moodStreak?.current || 0} days`}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          label="Avg Mood (7d)"
          value={stats?.averageMood ? `${stats.averageMood}/5` : '—'}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          label="Total Entries"
          value={stats?.totalEntries || 0}
          color="blue"
        />
      </div>

      {/* Today's Entries */}
      {todayEntries.length > 0 && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Entries</h2>
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center gap-4 bg-dark-800 rounded-xl p-4"
              >
                <div className={`w-10 h-10 ${moodColors[entry.moodScore - 1]} rounded-xl flex items-center justify-center text-xl`}>
                  {moodEmojis[entry.moodScore - 1]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{entry.moodLabel}</p>
                  {entry.journalEntry && (
                    <p className="text-dark-400 text-sm truncate">{entry.journalEntry}</p>
                  )}
                </div>
                <span className="text-xs text-dark-500">
                  {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction
          icon={<BookOpen className="w-5 h-5" />}
          title="Log Mood"
          desc="Record how you're feeling right now"
          onClick={() => navigate('/journal')}
        />
        <QuickAction
          icon={<BarChart3 className="w-5 h-5" />}
          title="View Analytics"
          desc="Discover your mood patterns"
          onClick={() => navigate('/analytics')}
        />
        <QuickAction
          icon={<Sparkles className="w-5 h-5" />}
          title="Wellness Exercise"
          desc="Try a calming activity"
          onClick={() => navigate('/wellness')}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
    <div className="flex items-center gap-3 mb-2">{icon}</div>
    <p className="text-xs text-dark-500">{label}</p>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

const QuickAction = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-dark-900 border border-dark-800 rounded-2xl p-5 text-left hover:border-primary-500/30 transition-colors group"
  >
    <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center text-primary-400 mb-3">
      {icon}
    </div>
    <h3 className="text-white font-medium mb-1">{title}</h3>
    <p className="text-dark-500 text-sm">{desc}</p>
    <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-400 mt-2 transition-colors" />
  </button>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default Dashboard;