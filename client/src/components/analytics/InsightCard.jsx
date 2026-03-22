import { Brain, Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendConfig = {
  improving: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  declining: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  stable: { icon: Minus, color: 'text-dark-400', bg: 'bg-dark-700/50 border-dark-600' }
};

const InsightCard = ({ type = 'info', title, children, trend }) => {
  if (trend) {
    const config = trendConfig[trend] || trendConfig.stable;
    const TrendIcon = config.icon;

    return (
      <div className={`${config.bg} border rounded-xl p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <TrendIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color} capitalize`}>
            {trend}
          </span>
        </div>
        {title && <p className="text-white font-medium text-sm">{title}</p>}
        <div className="text-dark-300 text-sm mt-1">{children}</div>
      </div>
    );
  }

  const icons = {
    info: <Brain className="w-4 h-4 text-primary-400" />,
    tip: <Lightbulb className="w-4 h-4 text-amber-400" />,
    positive: <span className="text-sm">💚</span>
  };

  const bgColors = {
    info: 'bg-primary-500/10 border-primary-500/20',
    tip: 'bg-amber-500/10 border-amber-500/20',
    positive: 'bg-green-500/10 border-green-500/20'
  };

  return (
    <div className={`${bgColors[type] || bgColors.info} border rounded-xl p-4`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5">{icons[type]}</span>
        <div className="flex-1">
          {title && <p className="text-white font-medium text-sm mb-1">{title}</p>}
          <div className="text-dark-300 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;