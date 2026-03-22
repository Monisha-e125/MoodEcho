import { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import useMood from '../../hooks/useMood';
import Button from '../common/Button';

const moodOptions = [
  { score: 1, label: 'Terrible', emoji: '😢', color: 'border-mood-1 bg-mood-1/10' },
  { score: 2, label: 'Bad', emoji: '😔', color: 'border-mood-2 bg-mood-2/10' },
  { score: 3, label: 'Okay', emoji: '😐', color: 'border-mood-3 bg-mood-3/10' },
  { score: 4, label: 'Good', emoji: '🙂', color: 'border-mood-4 bg-mood-4/10' },
  { score: 5, label: 'Great', emoji: '😄', color: 'border-mood-5 bg-mood-5/10' }
];

const MoodLogger = ({ onSuccess }) => {
  const { logMood, isSubmitting } = useMood();
  const [moodScore, setMoodScore] = useState(null);
  const [moodLabel, setMoodLabel] = useState('');
  const [journalEntry, setJournalEntry] = useState('');

  const selectMood = (mood) => {
    setMoodScore(mood.score);
    setMoodLabel(mood.label);
  };

  const handleSubmit = async () => {
    if (!moodScore) return toast.error('Please select a mood');

    const result = await logMood({
      moodScore,
      moodLabel,
      journalEntry: journalEntry.trim()
    });

    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Mood logged! 📝');
      setMoodScore(null);
      setMoodLabel('');
      setJournalEntry('');
      onSuccess?.(result.payload);
    }
  };

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Quick Mood Log</h3>

      {/* Mood Selection */}
      <div className="flex justify-between gap-2 mb-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.score}
            onClick={() => selectMood(mood)}
            className={`
              flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all
              ${moodScore === mood.score
                ? mood.color
                : 'border-dark-700 hover:border-dark-600'
              }
            `}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-xs text-dark-400">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Journal */}
      <textarea
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder="How are you feeling? (optional)"
        rows={2}
        maxLength={500}
        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-dark-100 placeholder-dark-500 resize-none focus:outline-none focus:border-primary-500 transition-colors mb-3"
      />

      <Button
        onClick={handleSubmit}
        fullWidth
        size="sm"
        isLoading={isSubmitting}
        disabled={!moodScore}
      >
        <Send className="w-3.5 h-3.5" /> Log Mood
      </Button>
    </div>
  );
};

export default MoodLogger;