const ChatMessage = ({ message, isMe }) => {
  const displayName = isMe
    ? 'You'
    : message.isAnonymous
      ? 'Anonymous'
      : message.sender?.name || message.userName || 'User';

  const time = new Date(message.createdAt || message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // System message
  if (message.type === 'system') {
    return (
      <div className="text-center py-2">
        <span className="text-xs text-dark-500 bg-dark-800/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  // Encouragement message
  if (message.type === 'encouragement') {
    return (
      <div className="flex justify-center py-1">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 max-w-xs">
          <p className="text-amber-300 text-sm text-center">
            💛 {message.content}
          </p>
          <p className="text-xs text-dark-500 text-center mt-1">
            from {displayName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`
          max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl
          ${isMe
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-dark-800 text-dark-200 rounded-bl-md'
          }
        `}
      >
        {/* Sender name (others only) */}
        {!isMe && (
          <p className={`text-xs mb-1 ${isMe ? 'text-primary-200' : 'text-dark-500'}`}>
            {displayName}
          </p>
        )}

        {/* Message content */}
        <p className="text-sm break-words">{message.content}</p>

        {/* Time */}
        <p className={`text-xs mt-1 ${isMe ? 'text-primary-200/60' : 'text-dark-600'} text-right`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;