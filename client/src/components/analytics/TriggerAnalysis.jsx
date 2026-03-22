const TriggerAnalysis = ({ triggers = [], emotions = [] }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Top Emotions */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Top Emotions</h3>
        {emotions.length > 0 ? (
          <div className="space-y-3">
            {emotions.map(({ emotion, count }) => {
              const maxCount = emotions[0]?.count || 1;
              const width = Math.max((count / maxCount) * 100, 15);

              return (
                <div key={emotion}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-dark-300 text-sm capitalize">{emotion}</span>
                    <span className="text-primary-400 text-sm font-medium">{count}x</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-dark-500 text-sm">No emotion data yet</p>
        )}
      </div>

      {/* Top Triggers */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Top Triggers</h3>
        {triggers.length > 0 ? (
          <div className="space-y-3">
            {triggers.map(({ trigger, count }) => {
              const maxCount = triggers[0]?.count || 1;
              const width = Math.max((count / maxCount) * 100, 15);

              return (
                <div key={trigger}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-dark-300 text-sm capitalize">{trigger}</span>
                    <span className="text-amber-400 text-sm font-medium">{count}x</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-dark-500 text-sm">No trigger data yet</p>
        )}
      </div>
    </div>
  );
};

export default TriggerAnalysis;