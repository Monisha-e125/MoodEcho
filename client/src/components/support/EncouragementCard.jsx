import { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import Button from '../common/Button';

const quickMessages = [
  'You are not alone 💙',
  'It gets better, I promise 🌅',
  'You are stronger than you think 💪',
  'Sending you positive vibes ✨',
  'Take it one moment at a time 🌱',
  'You matter, and your feelings are valid 💛',
  'Be gentle with yourself today 🤍',
  'This too shall pass 🌈'
];

const EncouragementCard = ({ onSend }) => {
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const message = customMessage.trim() || selectedMessage;
    if (!message) return;

    onSend?.(message);
    setSent(true);

    setTimeout(() => {
      setSent(false);
      setSelectedMessage('');
      setCustomMessage('');
    }, 2000);
  };

  if (sent) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in">
        <span className="text-3xl block mb-2">💛</span>
        <p className="text-green-300 font-medium">Encouragement sent!</p>
        <p className="text-dark-400 text-sm mt-1">Your kindness makes a difference.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-400" />
        <h3 className="text-white font-semibold">Send Encouragement</h3>
      </div>

      {/* Quick Messages */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickMessages.map((msg) => (
          <button
            key={msg}
            onClick={() => {
              setSelectedMessage(msg);
              setCustomMessage('');
            }}
            className={`
              px-3 py-1.5 rounded-lg text-sm transition-all
              ${selectedMessage === msg
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }
            `}
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Custom Message */}
      <div className="flex gap-2">
        <input
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedMessage('');
          }}
          placeholder="Or write your own message..."
          maxLength={200}
          className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        <Button
          onClick={handleSend}
          disabled={!selectedMessage && !customMessage.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EncouragementCard;