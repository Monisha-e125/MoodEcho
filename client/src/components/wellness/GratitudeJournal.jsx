import { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import wellnessService from '../../services/wellnessService';
import Button from '../common/Button';

const defaultPrompts = [
  'Something that made you smile today',
  'A person you are thankful for',
  'Something small but good that happened'
];

const GratitudeJournal = ({ prompts = defaultPrompts, onComplete }) => {
  const [entries, setEntries] = useState(prompts.map(() => ''));
  const [submitting, setSubmitting] = useState(false);

  const updateEntry = (index, value) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const filled = entries.filter((e) => e.trim().length > 0);
    if (filled.length === 0) {
      return toast.error('Write at least one gratitude entry');
    }

    setSubmitting(true);
    try {
      await wellnessService.logActivity({
        type: 'gratitude',
        duration: 300,
        notes: entries.filter((e) => e.trim()).join(' | ')
      });
      toast.success('Gratitude logged! 💛');
      onComplete?.();
    } catch {
      toast.error('Failed to save');
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-pink-600/10 to-amber-600/10 border border-pink-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-400" />
        <h2 className="text-lg font-semibold text-white">Three Good Things</h2>
      </div>
      <p className="text-dark-400 text-sm mb-4">
        Write down 3 things you&apos;re grateful for today.
      </p>

      <div className="space-y-3">
        {prompts.map((prompt, i) => (
          <div key={i}>
            <label className="text-sm text-dark-300 mb-1 block">
              {i + 1}. {prompt}
            </label>
            <input
              type="text"
              value={entries[i]}
              onChange={(e) => updateEntry(i, e.target.value)}
              placeholder="Type here..."
              maxLength={200}
              className="w-full bg-dark-800/50 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        ))}
      </div>

      <Button
        className="mt-4"
        fullWidth
        onClick={handleSubmit}
        isLoading={submitting}
      >
        <Send className="w-4 h-4" /> Save Gratitude
      </Button>
    </div>
  );
};

export default GratitudeJournal;