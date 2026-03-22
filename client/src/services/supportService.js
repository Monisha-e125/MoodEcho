import api from '../api/axios';

const supportService = {
  getRooms: () => api.get('/support/rooms'),

  getMessages: (roomId) => api.get(`/support/rooms/${roomId}/messages`),

  sendMessage: (roomId, content, isAnonymous = true) =>
    api.post(`/support/rooms/${roomId}/messages`, { content, isAnonymous }),

  getHelplines: () => api.get('/support/helplines')
};

export default supportService;