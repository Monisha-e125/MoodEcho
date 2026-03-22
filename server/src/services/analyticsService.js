const MoodEntry = require('../models/MoodEntry');
const logger = require('../utils/logger');

class AnalyticsService {
  /**
   * Get mood statistics for a user
   */
  static async getMoodStats(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const entries = await MoodEntry.find({
        user: userId,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: -1 });

      if (entries.length === 0) {
        return {
          totalEntries: 0,
          averageMood: 0,
          moodTrend: 'stable',
          topEmotions: [],
          topTriggers: [],
          dailyAverage: [],
          weekdayPattern: {},
          streakDays: 0
        };
      }

      // Average mood
      const totalMood = entries.reduce((sum, e) => sum + e.moodScore, 0);
      const averageMood = parseFloat((totalMood / entries.length).toFixed(2));

      // Mood trend (compare first half vs second half)
      const midPoint = Math.floor(entries.length / 2);
      const recentAvg =
        entries.slice(0, midPoint).reduce((s, e) => s + e.moodScore, 0) /
        Math.max(midPoint, 1);
      const olderAvg =
        entries.slice(midPoint).reduce((s, e) => s + e.moodScore, 0) /
        Math.max(entries.length - midPoint, 1);

      let moodTrend = 'stable';
      if (recentAvg - olderAvg > 0.3) moodTrend = 'improving';
      else if (olderAvg - recentAvg > 0.3) moodTrend = 'declining';

      // Top emotions
      const emotionCount = {};
      entries.forEach((e) => {
        e.emotions.forEach((emotion) => {
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        });
      });
      const topEmotions = Object.entries(emotionCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([emotion, count]) => ({ emotion, count }));

      // Top triggers
      const triggerCount = {};
      entries.forEach((e) => {
        e.triggers.forEach((trigger) => {
          triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
        });
      });
      const topTriggers = Object.entries(triggerCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([trigger, count]) => ({ trigger, count }));

      // Daily average (for chart)
      const dailyMap = {};
      entries.forEach((e) => {
        const dateKey = e.createdAt.toISOString().split('T')[0];
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { total: 0, count: 0 };
        }
        dailyMap[dateKey].total += e.moodScore;
        dailyMap[dateKey].count += 1;
      });
      const dailyAverage = Object.entries(dailyMap)
        .map(([date, data]) => ({
          date,
          average: parseFloat((data.total / data.count).toFixed(2)),
          count: data.count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Weekday pattern
      const weekdayMap = {
        0: { name: 'Sun', total: 0, count: 0 },
        1: { name: 'Mon', total: 0, count: 0 },
        2: { name: 'Tue', total: 0, count: 0 },
        3: { name: 'Wed', total: 0, count: 0 },
        4: { name: 'Thu', total: 0, count: 0 },
        5: { name: 'Fri', total: 0, count: 0 },
        6: { name: 'Sat', total: 0, count: 0 }
      };
      entries.forEach((e) => {
        const day = e.createdAt.getDay();
        weekdayMap[day].total += e.moodScore;
        weekdayMap[day].count += 1;
      });
      const weekdayPattern = Object.values(weekdayMap).map((d) => ({
        day: d.name,
        average: d.count > 0 ? parseFloat((d.total / d.count).toFixed(2)) : 0,
        entries: d.count
      }));

      return {
        totalEntries: entries.length,
        averageMood,
        moodTrend,
        topEmotions,
        topTriggers,
        dailyAverage,
        weekdayPattern,
        period: `Last ${days} days`
      };
    } catch (error) {
      logger.error(`Analytics error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get calendar heatmap data
   */
  static async getCalendarData(userId, year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const entries = await MoodEntry.find({
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).select('moodScore createdAt');

      const calendarMap = {};
      entries.forEach((e) => {
        const dateKey = e.createdAt.toISOString().split('T')[0];
        if (!calendarMap[dateKey]) {
          calendarMap[dateKey] = { scores: [], count: 0 };
        }
        calendarMap[dateKey].scores.push(e.moodScore);
        calendarMap[dateKey].count += 1;
      });

      const calendarData = Object.entries(calendarMap).map(([date, data]) => ({
        date,
        averageMood: parseFloat(
          (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1)
        ),
        entries: data.count
      }));

      return calendarData;
    } catch (error) {
      logger.error(`Calendar data error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AnalyticsService;