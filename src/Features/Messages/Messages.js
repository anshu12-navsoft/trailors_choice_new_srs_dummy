import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';

import Icon from 'react-native-vector-icons/MaterialIcons';
import socketService from '../../Services/socket.service';
import {
  setConnected,
  setConversations,
  upsertConversation,
  appendMessage,
  setTyping,
} from '../../App/Redux/Slices/chatSlice';

/* ── TODO: remove once backend is live ── */
const MOCK_CONVERSATIONS = [
  {
    id: 'conv_1',
    isGroup: false,
    otherUser: { id: 'u2', name: 'Sarah Johnson' },
    lastMessage: 'Is the trailer still available this weekend?',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv_2',
    isGroup: false,
    otherUser: { id: 'u3', name: 'Mike Torres' },
    lastMessage: "Great, I'll pick it up at 9am.",
    lastMessageTime: new Date(Date.now() - 3600_000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'group_demo',
    isGroup: true,
    groupName: 'Trailer Crew',
    participants: [
      { id: 'u4', name: 'Emily Chen' },
      { id: 'u5', name: 'David Kim' },
      { id: 'u6', name: 'Lisa Park' },
    ],
    lastMessage: 'Anyone free Saturday morning?',
    lastMessageTime: new Date(Date.now() - 7200_000).toISOString(),
    unreadCount: 3,
  },
  {
    id: 'conv_3',
    isGroup: false,
    otherUser: { id: 'u4', name: 'Emily Chen' },
    lastMessage: 'Thanks for the quick response!',
    lastMessageTime: new Date(Date.now() - 86400_000).toISOString(),
    unreadCount: 0,
  },
];

const Messages = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { conversations: liveConversations, connected } = useSelector(state => state.chat);
  /* TODO: remove MOCK_CONVERSATIONS fallback once backend is live */
  const conversations = liveConversations.length > 0 ? liveConversations : MOCK_CONVERSATIONS;
  const currentUserId = useSelector(state => state.auth.userId);

  /* ── socket lifecycle ── */
  useEffect(() => {
    socketService.connect().then(() => {
      dispatch(setConnected(true));

      /* server sends full conversations list on connect */
      socketService.on('conversations', data => {
        dispatch(setConversations(data));
      });

      /* a new message arrived (updates preview in list) */
      socketService.on('receive_message', ({ conversationId, message }) => {
        dispatch(appendMessage({ conversationId, message }));
        dispatch(upsertConversation({
          id: conversationId,
          lastMessage: message.text,
          lastMessageTime: message.createdAt,
        }));
      });

      /* typing indicator */
      socketService.on('typing', ({ conversationId }) => {
        dispatch(setTyping({ conversationId, isTyping: true }));
      });
      socketService.on('stop_typing', ({ conversationId }) => {
        dispatch(setTyping({ conversationId, isTyping: false }));
      });

      /* request conversations list */
      socketService.emit('get_conversations', { userId: currentUserId });
    });

    return () => {
      socketService.off('conversations');
      socketService.off('receive_message');
      socketService.off('typing');
      socketService.off('stop_typing');
      dispatch(setConnected(false));
    };
  }, [dispatch, currentUserId]);

  /* ── helpers ── */
  const formatTime = useCallback(isoString => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, []);

  /* ── render ── */
  const renderItem = ({ item }) => {
    const displayName = item.isGroup
      ? item.groupName
      : (item.otherUser?.name ?? t('chat_unknown_user'));

    return (
      <Pressable
        style={styles.row}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
            otherUser: item.otherUser ?? null,
            isGroup: item.isGroup ?? false,
            groupName: item.groupName ?? null,
            participants: item.participants ?? [],
          })
        }
      >
        {/* Avatar */}
        <View style={[styles.avatar, item.isGroup && styles.avatarGroup]}>
          {item.isGroup
            ? <Icon name="group" size={moderateScale(22)} color="#fff" />
            : <Text style={styles.avatarText}>{displayName[0]?.toUpperCase() ?? '?'}</Text>
          }
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.bodyTop}>
            <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.bodyBottom}>
            <Text style={styles.preview} numberOfLines={1}>
              {item.lastMessage ?? t('chat_no_messages')}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.title}>{t('messages_title')}</Text>
        {connected && <View style={styles.onlineDot} />}
      </View>

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={conversations.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('chat_no_conversations')}</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* FAB – start new chat */}
      <Pressable style={styles.fab} onPress={() => navigation.navigate('NewChat')}>
        <Icon name="edit" size={moderateScale(22)} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  title: { fontSize: moderateScale(20), fontWeight: '600', flex: 1 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    backgroundColor: '#fff',
  },

  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },

  body: { flex: 1 },
  bodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bodyBottom: { flexDirection: 'row', alignItems: 'center' },

  name: { fontWeight: '600', fontSize: moderateScale(14), flex: 1 },
  time: { fontSize: moderateScale(11), color: '#999' },
  preview: { fontSize: moderateScale(13), color: '#666', flex: 1 },

  badge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  badgeText: { color: '#fff', fontSize: moderateScale(10), fontWeight: '700' },

  separator: { height: 1, backgroundColor: '#F5F5F5', marginLeft: moderateScale(76) },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#999', fontSize: moderateScale(14) },

  avatarGroup: { backgroundColor: '#7C3AED' },

  fab: {
    position: 'absolute',
    bottom: moderateScale(24),
    right: moderateScale(20),
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default Messages;
