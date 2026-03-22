import { useState } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import InsightCard from './InsightCard';
import Button from '../common/Button';
import Loader from '../common/Loader';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getWeeklyInsights();
      setReport(res.data.data);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-400" />
          AI Weekly Report
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={generateReport}
          isLoading={loading}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {report ? 'Refresh' : 'Generate'}
        </Button>
      </div>

      {loading && <Loader text="AI is analyzing your week..." />}

      {!loading && !report && (
        <p className="text-dark-500 text-sm text-center py-4">
          Click &ldquo;Generate&rdquo; for AI-powered insights about your week.
        </p>
      )}

      {!loading && report && (
        <div className="space-y-3">
          {/* Summary */}
          <InsightCard type="info" title="Weekly Summary">
            {report.summary}
          </InsightCard>

          {/* Trend */}
          {report.moodTrend && (
            <InsightCard trend={report.moodTrend} title="Mood Trend">
              Average mood: {report.averageMood}/5
            </InsightCard>
          )}

          {/* Positive note */}
          {report.positiveNote && (
            <InsightCard type="positive" title="Bright Spot">
              {report.positiveNote}
            </InsightCard>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Recommendations</h4>
              <ul className="space-y-1.5">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                    <span className="text-primary-400 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patterns */}
          {report.patterns?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Patterns Detected</h4>
              {report.patterns.map((pattern, i) => (
                <InsightCard key={i} type="tip">
                  {pattern}
                </InsightCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;