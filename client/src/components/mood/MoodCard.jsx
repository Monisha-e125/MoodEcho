const moodEmojis = ['😢', '😔', '😐', '🙂', '😄'];
const moodColors = [
  'bg-mood-1/15 border-mood-1/30',
  'bg-mood-2/15 border-mood-2/30',
  'bg-mood-3/15 border-mood-3/30',
  'bg-mood-4/15 border-mood-4/30',
  'bg-mood-5/15 border-mood-5/30'
];

const MoodCard = ({ entry, onClick }) => {
  const idx = entry.moodScore - 1;

  return (
    <div
      onClick={() => onClick?.(entry)}
      className={`
        ${moodColors[idx]} border rounded-xl p-4
        ${onClick ? 'cursor-pointer hover:brightness-110' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <div className="text-2xl">{moodEmojis[idx]}</div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-white font-medium">{entry.moodLabel}</p>
            <span className="text-xs text-dark-500">
              {new Date(entry.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Journal preview */}
          {entry.journalEntry && (
            <p className="text-dark-400 text-sm mt-1 truncate">
              {entry.journalEntry}
            </p>
          )}

          {/* Emotions */}
          {entry.emotions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.emotions.slice(0, 4).map((emotion) => (
                <span
                  key={emotion}
                  className="px-2 py-0.5 bg-dark-800/50 rounded text-xs text-dark-400 capitalize"
                >
                  {emotion}
                </span>
              ))}
              {entry.emotions.length > 4 && (
                <span className="text-xs text-dark-500">
                  +{entry.emotions.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Sentiment Badge */}
      {entry.aiAnalysis?.sentiment && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-xs text-primary-400">🧠</span>
          <span className="text-xs text-primary-400 capitalize">
            {entry.aiAnalysis.sentiment.replace('_', ' ')}
          </span>
        </div>
      )}

      {/* Crisis badge */}
      {entry.crisisDetected && (
        <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1">
          <span className="text-xs text-red-400">⚠️ Crisis support shown</span>
        </div>
      )}
    </div>
  );
};

export default MoodCard;