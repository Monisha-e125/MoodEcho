import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-dark-400">
        {new Date(label).toLocaleDateString('en', {
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        })}
      </p>
      <p className="text-sm text-white font-medium">
        Mood: {payload[0].value}/5
      </p>
    </div>
  );
};

const MoodChart = ({ data, height = 256 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-dark-500 text-sm" style={{ height }}>
        No data to display
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })
            }
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={25}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="average"
            stroke="#6366f1"
            fill="url(#moodGradient)"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5, fill: '#818cf8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;