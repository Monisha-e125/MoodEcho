import { useState, useEffect, useRef } from 'react';
import { Send, Users, ArrowLeft } from 'lucide-react';
import supportService from '../services/supportService';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import Button from '../components/common/Button';

const Support = () => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const { user } = useSelector((s) => s.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supportService.getRooms()
      .then((res) => setRooms(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    supportService.getMessages(activeRoom._id)
      .then((res) => setMessages(res.data.data))
      .catch(() => {});

    if (socket) {
      socket.emit('join-room', activeRoom._id);
      socket.on('new-message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave-room', activeRoom._id);
        socket.off('new-message');
      }
    };
  }, [activeRoom, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeRoom) return;

    if (socket) {
      socket.emit('send-message', {
        roomId: activeRoom._id,
        content: message.trim()
      });
    }

    supportService.sendMessage(activeRoom._id, message.trim()).catch(() => {});
    setMessage('');
  };

  // Room list view
  if (!activeRoom) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Peer Support</h1>
          <p className="text-dark-400 mt-1">Join anonymous support rooms</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-sm">
            💛 All messages are anonymous. Be kind and supportive. This is NOT a substitute for professional help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => setActiveRoom(room)}
              className="bg-dark-900 border border-dark-800 hover:border-primary-500/30 rounded-2xl p-5 text-left transition-colors"
            >
              <h3 className="text-white font-semibold text-lg">{room.name}</h3>
              <p className="text-dark-400 text-sm mt-1">{room.description}</p>
              <div className="flex items-center gap-2 mt-3 text-dark-500 text-xs">
                <Users className="w-3.5 h-3.5" />
                {room.activeUsers || 0} active
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-dark-800">
        <button
          onClick={() => setActiveRoom(null)}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-white font-semibold">{activeRoom.name}</h2>
          <p className="text-dark-500 text-xs">{activeRoom.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user?._id || msg.userId === user?._id;
          return (
            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                  isMe
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-dark-200'
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-dark-500 mb-1">
                    {msg.isAnonymous ? 'Anonymous' : msg.sender?.name || msg.userName}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-dark-800">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a supportive message..."
          maxLength={1000}
          className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
        <Button type="submit" disabled={!message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default Support;