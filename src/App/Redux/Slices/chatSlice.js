import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],      // [{ id, otherUser, lastMessage, lastMessageTime, unreadCount }]
    messages: {},           // { [conversationId]: [...messages] }
    typing: {},             // { [conversationId]: boolean }
    connected: false,
  },
  reducers: {
    setConnected(state, action) {
      state.connected = action.payload;
    },

    setConversations(state, action) {
      state.conversations = action.payload;
    },

    upsertConversation(state, action) {
      const incoming = action.payload;
      const index = state.conversations.findIndex(c => c.id === incoming.id);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...incoming };
      } else {
        state.conversations.unshift(incoming);
      }
    },

    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    appendMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      // avoid duplicates by _id
      const exists = state.messages[conversationId].some(m => m._id === message._id);
      if (!exists) {
        state.messages[conversationId].push(message);
      }
      // update conversation preview
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = message.text;
        conv.lastMessageTime = message.createdAt;
      }
    },

    markMessagesRead(state, action) {
      const { conversationId, userId } = action.payload;
      const msgs = state.messages[conversationId];
      if (!msgs) return;
      msgs.forEach(m => {
        if (m.senderId !== userId) m.read = true;
      });
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) conv.unreadCount = 0;
    },

    setTyping(state, action) {
      const { conversationId, isTyping } = action.payload;
      state.typing[conversationId] = isTyping;
    },
  },
});

export const {
  setConnected,
  setConversations,
  upsertConversation,
  setMessages,
  appendMessage,
  markMessagesRead,
  setTyping,
} = chatSlice.actions;

export default chatSlice.reducer;
