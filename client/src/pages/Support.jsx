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
      socket.emit('send-message', { roomId: activeRoom._id, content: message.trim() });
    }
    supportService.sendMessage(activeRoom._id, message.trim()).catch(() => {});
    setMessage('');
  };

  // Room List
  if (!activeRoom) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Peer Support</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '15px' }}>Join anonymous support rooms</p>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '14px',
            padding: '16px 20px',
          }}
        >
          <p style={{ color: '#fcd34d', fontSize: '14px', fontWeight: '500' }}>
            💛 All messages are anonymous. Be kind and supportive. This is NOT a substitute for professional help.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => setActiveRoom(room)}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e293b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>{room.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>{room.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                <Users size={14} style={{ color: '#64748b' }} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{room.activeUsers || 0} active</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          paddingBottom: '16px',
          borderBottom: '1px solid #1e293b',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setActiveRoom(null)}
          style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px' }}>{activeRoom.name}</h2>
          <p style={{ color: '#64748b', fontSize: '12px' }}>{activeRoom.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user?._id || msg.userId === user?._id;
          return (
            <div key={msg._id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '340px',
                  padding: '12px 16px',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: isMe ? '#4f46e5' : '#1e293b',
                  color: isMe ? '#ffffff' : '#e2e8f0',
                }}
              >
                {!isMe && (
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                    {msg.isAnonymous ? 'Anonymous' : msg.sender?.name || msg.userName}
                  </p>
                )}
                <p style={{ fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word' }}>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        style={{
          display: 'flex',
          gap: '10px',
          paddingTop: '16px',
          borderTop: '1px solid #1e293b',
          marginTop: '16px',
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a supportive message..."
          maxLength={1000}
          style={{
            flex: 1,
            height: '44px',
            backgroundColor: '#0f172a',
            border: '1.5px solid #334155',
            borderRadius: '12px',
            padding: '0 16px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
          onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
        />
        <Button type="submit" disabled={!message.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default Support;