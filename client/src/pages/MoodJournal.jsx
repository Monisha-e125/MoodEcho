import { useState, useEffect } from 'react';
import { Send, Brain, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import useMood from '../hooks/useMood';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const moodOptions = [
  { score: 1, label: 'Terrible', emoji: '😢', color: 'border-mood-1 bg-mood-1/10' },
  { score: 2, label: 'Bad', emoji: '😔', color: 'border-mood-2 bg-mood-2/10' },
  { score: 3, label: 'Okay', emoji: '😐', color: 'border-mood-3 bg-mood-3/10' },
  { score: 4, label: 'Good', emoji: '🙂', color: 'border-mood-4 bg-mood-4/10' },
  { score: 5, label: 'Great', emoji: '😄', color: 'border-mood-5 bg-mood-5/10' }
];

const emotionOptions = [
  'happy', 'sad', 'anxious', 'angry', 'calm', 'stressed',
  'grateful', 'lonely', 'excited', 'overwhelmed', 'hopeful',
  'frustrated', 'peaceful', 'confused', 'motivated', 'exhausted', 'content'
];

const triggerOptions = [
  'work', 'family', 'relationships', 'health', 'money',
  'sleep', 'social', 'weather', 'exercise', 'food',
  'news', 'achievement', 'conflict', 'loneliness', 'other'
];

const MoodJournal = () => {
  const { logMood, isSubmitting, aiInsights, crisisAlert, clearInsights, clearCrisis } = useMood();
  const [showInsights, setShowInsights] = useState(false);

  const [form, setForm] = useState({
    moodScore: null,
    moodLabel: '',
    journalEntry: '',
    emotions: [],
    energyLevel: 3,
    sleepHours: 7,
    triggers: []
  });

  useEffect(() => {
    if (aiInsights) setShowInsights(true);
  }, [aiInsights]);

  const selectMood = (mood) => {
    setForm((p) => ({ ...p, moodScore: mood.score, moodLabel: mood.label }));
  };

  const toggleEmotion = (emotion) => {
    setForm((p) => ({
      ...p,
      emotions: p.emotions.includes(emotion)
        ? p.emotions.filter((e) => e !== emotion)
        : [...p.emotions, emotion]
    }));
  };

  const toggleTrigger = (trigger) => {
    setForm((p) => ({
      ...p,
      triggers: p.triggers.includes(trigger)
        ? p.triggers.filter((t) => t !== trigger)
        : [...p.triggers, trigger]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.moodScore) return toast.error('Please select a mood');

    const result = await logMood(form);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Mood logged! 📝');
      // Reset form
      setForm({
        moodScore: null, moodLabel: '', journalEntry: '',
        emotions: [], energyLevel: 3, sleepHours: 7, triggers: []
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mood Journal</h1>
        <p className="text-dark-400 mt-1">How are you feeling right now?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Select your mood</h2>
          <div className="flex justify-between gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.score}
                type="button"
                onClick={() => selectMood(mood)}
                className={`
                  flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                  ${form.moodScore === mood.score
                    ? mood.color
                    : 'border-dark-700 hover:border-dark-600'
                  }
                `}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-dark-300">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-2">
            Journal Entry <span className="text-dark-500 text-sm font-normal">(optional)</span>
          </h2>
          <p className="text-dark-500 text-sm mb-3">
            Write about how you feel. AI will analyze your entry for insights.
          </p>
          <textarea
            value={form.journalEntry}
            onChange={(e) => setForm((p) => ({ ...p, journalEntry: e.target.value }))}
            placeholder="Today I feel... because..."
            rows={4}
            maxLength={2000}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 resize-none focus:outline-none focus:border-primary-500 transition-colors"
          />
          <p className="text-xs text-dark-600 mt-1 text-right">
            {form.journalEntry.length}/2000
          </p>
        </div>

        {/* Emotions */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-3">
            Emotions <span className="text-dark-500 text-sm font-normal">(select all that apply)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm capitalize transition-all
                  ${form.emotions.includes(emotion)
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }
                `}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Sleep */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-medium mb-2">Energy Level</h3>
              <input
                type="range" min={1} max={5} step={1}
                value={form.energyLevel}
                onChange={(e) => setForm((p) => ({ ...p, energyLevel: parseInt(e.target.value) }))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-dark-500 mt-1">
                <span>Low</span><span>High</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">
                Sleep: {form.sleepHours}h
              </h3>
              <input
                type="range" min={0} max={12} step={0.5}
                value={form.sleepHours}
                onChange={(e) => setForm((p) => ({ ...p, sleepHours: parseFloat(e.target.value) }))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-dark-500 mt-1">
                <span>0h</span><span>12h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-3">
            Triggers <span className="text-dark-500 text-sm font-normal">(what affected your mood?)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {triggerOptions.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleTrigger(trigger)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm capitalize transition-all
                  ${form.triggers.includes(trigger)
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }
                `}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          <Send className="w-4 h-4" /> Log Mood
        </Button>
      </form>

      {/* Crisis Alert */}
      {crisisAlert && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium">{crisisAlert.message}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {crisisAlert.helplines?.slice(0, 3).map((h, i) => (
                  <a
                    key={i}
                    href={`tel:${h.number}`}
                    className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm text-red-300 transition-colors"
                  >
                    📞 {h.name}: {h.number}
                  </a>
                ))}
              </div>
              <button
                onClick={clearCrisis}
                className="text-xs text-dark-500 hover:text-dark-400 mt-3"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      <Modal
        isOpen={showInsights}
        onClose={() => { setShowInsights(false); clearInsights(); }}
        title="🧠 AI Insights"
        maxWidth="max-w-md"
      >
        {aiInsights && (
          <div className="space-y-4">
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">
                  Sentiment: {aiInsights.sentiment?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-dark-300 text-sm">{aiInsights.insights}</p>
            </div>

            {aiInsights.suggestions?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Suggestions</h4>
                <ul className="space-y-2">
                  {aiInsights.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                      <span className="text-primary-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              fullWidth
              onClick={() => { setShowInsights(false); clearInsights(); }}
            >
              Got it ✨
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MoodJournal;