import { useState, useEffect } from 'react';
import { Send, Brain, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import useMood from '../hooks/useMood';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const moodOptions = [
  { score: 1, label: 'Terrible', emoji: '😢', color: '#ef4444' },
  { score: 2, label: 'Bad', emoji: '😔', color: '#f97316' },
  { score: 3, label: 'Okay', emoji: '😐', color: '#eab308' },
  { score: 4, label: 'Good', emoji: '🙂', color: '#22c55e' },
  { score: 5, label: 'Great', emoji: '😄', color: '#06b6d4' },
];

const emotionOptions = [
  'happy', 'sad', 'anxious', 'angry', 'calm', 'stressed',
  'grateful', 'lonely', 'excited', 'overwhelmed', 'hopeful',
  'frustrated', 'peaceful', 'confused', 'motivated', 'exhausted', 'content',
];

const triggerOptions = [
  'work', 'family', 'relationships', 'health', 'money',
  'sleep', 'social', 'weather', 'exercise', 'food',
  'news', 'achievement', 'conflict', 'loneliness', 'other',
];

const cardStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '20px',
  padding: '28px',
};

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
    triggers: [],
  });

  useEffect(() => {
    if (aiInsights) setShowInsights(true);
  }, [aiInsights]);

  const selectMood = (mood) => {
    setForm((p) => ({ ...p, moodScore: mood.score, moodLabel: mood.label }));
  };

  const toggleItem = (key, item) => {
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(item)
        ? p[key].filter((i) => i !== item)
        : [...p[key], item],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.moodScore) return toast.error('Please select a mood');

    const result = await logMood(form);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Mood logged! 📝');
      setForm({
        moodScore: null, moodLabel: '', journalEntry: '',
        emotions: [], energyLevel: 3, sleepHours: 7, triggers: [],
      });
    }
  };

  const chipStyle = (selected) => ({
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'capitalize',
    transition: 'all 0.2s',
    backgroundColor: selected ? '#4f46e5' : '#1e293b',
    color: selected ? '#ffffff' : '#94a3b8',
  });

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Mood Journal</h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '15px' }}>How are you feeling right now?</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Mood Selection */}
        <div style={cardStyle}>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '20px' }}>
            Select your mood
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            {moodOptions.map((mood) => (
              <button
                key={mood.score}
                type="button"
                onClick={() => selectMood(mood)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 8px',
                  borderRadius: '14px',
                  border: form.moodScore === mood.score
                    ? `2px solid ${mood.color}`
                    : '2px solid #334155',
                  backgroundColor: form.moodScore === mood.score
                    ? `${mood.color}15`
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '28px' }}>{mood.emoji}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <div style={cardStyle}>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
            Journal Entry
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            Write about how you feel. AI will analyze your entry for insights.
          </p>
          <textarea
            value={form.journalEntry}
            onChange={(e) => setForm((p) => ({ ...p, journalEntry: e.target.value }))}
            placeholder="Today I feel... because..."
            rows={4}
            maxLength={2000}
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              border: '1.5px solid #334155',
              borderRadius: '12px',
              padding: '14px 16px',
              color: '#e2e8f0',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
            onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
          />
          <p style={{ fontSize: '11px', color: '#475569', textAlign: 'right', marginTop: '6px' }}>
            {form.journalEntry.length}/2000
          </p>
        </div>

        {/* Emotions */}
        <div style={cardStyle}>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
            Emotions
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            Select all that apply
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {emotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleItem('emotions', emotion)}
                style={chipStyle(form.emotions.includes(emotion))}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Sleep */}
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            <div>
              <h3 style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                Energy Level: {form.energyLevel}/5
              </h3>
              <input
                type="range" min={1} max={5} step={1}
                value={form.energyLevel}
                onChange={(e) => setForm((p) => ({ ...p, energyLevel: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                <span>Low</span><span>High</span>
              </div>
            </div>
            <div>
              <h3 style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px', marginBottom: '12px' }}>
                Sleep: {form.sleepHours}h
              </h3>
              <input
                type="range" min={0} max={12} step={0.5}
                value={form.sleepHours}
                onChange={(e) => setForm((p) => ({ ...p, sleepHours: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                <span>0h</span><span>12h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div style={cardStyle}>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
            Triggers
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            What affected your mood?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {triggerOptions.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleItem('triggers', trigger)}
                style={chipStyle(form.triggers.includes(trigger))}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          <Send size={16} /> Log Mood
        </Button>
      </form>

      {/* Crisis Alert */}
      {crisisAlert && (
        <div
          style={{
            backgroundColor: 'rgba(127,29,29,0.2)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ color: '#fca5a5', fontWeight: '600', fontSize: '14px' }}>{crisisAlert.message}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {crisisAlert.helplines?.slice(0, 3).map((h, i) => (
                  <a
                    key={i}
                    href={`tel:${h.number}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(239,68,68,0.15)',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      color: '#fca5a5',
                      fontSize: '13px',
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    📞 {h.name}: {h.number}
                  </a>
                ))}
              </div>
              <button
                onClick={clearCrisis}
                style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
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
      >
        {aiInsights && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Brain size={16} style={{ color: '#818cf8' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#a5b4fc', textTransform: 'capitalize' }}>
                  Sentiment: {aiInsights.sentiment?.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{aiInsights.insights}</p>
            </div>

            {aiInsights.suggestions?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '10px' }}>
                  Suggestions
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiInsights.suggestions.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#94a3b8' }}>
                      <span style={{ color: '#818cf8' }}>•</span>
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