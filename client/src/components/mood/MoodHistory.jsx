import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import useMood from '../../hooks/useMood';
import MoodCard from './MoodCard';
import Loader from '../common/Loader';

const MoodHistory = ({ days = 7, limit = 10, onEntryClick }) => {
  const { entries, isLoading, pagination, getHistory } = useMood();

  useEffect(() => {
    getHistory({ days, limit, page: 1 });
  }, [getHistory, days, limit]);

  if (isLoading) return <Loader text="Loading history..." />;

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-3 block">📝</span>
        <p className="text-dark-400">No mood entries yet.</p>
        <p className="text-dark-500 text-sm mt-1">Start logging to see your history.</p>
      </div>
    );
  }

  // Group entries by date
  const grouped = entries.reduce((acc, entry) => {
    const dateKey = new Date(entry.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-dark-500" />
        <h3 className="text-sm font-medium text-dark-400">
          {pagination?.totalItems || entries.length} entries — Last {days} days
        </h3>
      </div>

      {Object.entries(grouped).map(([date, dateEntries]) => (
        <div key={date}>
          <p className="text-xs text-dark-500 font-medium mb-2 uppercase tracking-wider">
            {date}
          </p>
          <div className="space-y-2">
            {dateEntries.map((entry) => (
              <MoodCard key={entry._id} entry={entry} onClick={onEntryClick} />
            ))}
          </div>
        </div>
      ))}

      {/* Load More */}
      {pagination?.hasNext && (
        <button
          onClick={() => getHistory({ days, limit, page: (pagination?.currentPage || 1) + 1 })}
          className="w-full py-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          Load more entries...
        </button>
      )}
    </div>
  );
};

export default MoodHistory;