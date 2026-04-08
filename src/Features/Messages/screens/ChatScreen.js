import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../stylesheets/Chat.style';
import socketService from '../../../Services/socket.service';
import {
  setMessages,
  appendMessage,
  markMessagesRead,
  setTyping,
} from '../../../App/Redux/Slices/chatSlice';

let typingTimer = null;

/* ── TODO: remove once backend is live ── */
const MOCK_MESSAGES = {
  group_demo: [
    {
      _id: 'g1',
      senderId: 'u4',
      senderName: 'Emily',
      text: 'Hey team, anyone free Saturday?',
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
      read: true,
    },
    {
      _id: 'g2',
      senderId: 'u5',
      senderName: 'David',
      text: 'I can do Saturday morning!',
      createdAt: new Date(Date.now() - 6000_000).toISOString(),
      read: true,
    },
    {
      _id: 'g3',
      senderId: 'me',
      senderName: 'Me',
      text: 'Same, what time works?',
      createdAt: new Date(Date.now() - 5400_000).toISOString(),
      read: true,
    },
    {
      _id: 'g4',
      senderId: 'u4',
      senderName: 'Emily',
      text: 'Anyone free Saturday morning?',
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      read: false,
    },
  ],
  conv_1: [
    {
      _id: 'm1',
      senderId: 'u2',
      text: 'Hey! Is the trailer still available this weekend?',
      createdAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
      read: true,
    },
    {
      _id: 'm2',
      senderId: 'me',
      text: 'Yes it is! Saturday or Sunday?',
      createdAt: new Date(Date.now() - 3600_000 * 1.5).toISOString(),
      read: true,
    },
    {
      _id: 'm3',
      senderId: 'u2',
      text: 'Saturday would be perfect. What time can I pick it up?',
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      read: true,
    },
    {
      _id: 'm4',
      senderId: 'u2',
      text: 'Is the trailer still available this weekend?',
      createdAt: new Date(Date.now() - 600_000).toISOString(),
      read: false,
    },
  ],
  conv_2: [
    {
      _id: 'm5',
      senderId: 'me',
      text: 'Hi Mike, your booking is confirmed.',
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
      read: true,
    },
    {
      _id: 'm6',
      senderId: 'u3',
      text: 'Awesome, thanks!',
      createdAt: new Date(Date.now() - 5400_000).toISOString(),
      read: true,
    },
    {
      _id: 'm7',
      senderId: 'u3',
      text: "Great, I'll pick it up at 9am.",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      read: true,
    },
  ],
  conv_3: [
    {
      _id: 'm8',
      senderId: 'u4',
      text: 'Do you deliver to downtown?',
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
      read: true,
    },
    {
      _id: 'm9',
      senderId: 'me',
      text: 'Sorry, pickup only at the moment.',
      createdAt: new Date(Date.now() - 82800_000).toISOString(),
      read: true,
    },
    {
      _id: 'm10',
      senderId: 'u4',
      text: 'Thanks for the quick response!',
      createdAt: new Date(Date.now() - 79200_000).toISOString(),
      read: true,
    },
  ],
};

const ChatScreen = ({ route, navigation }) => {
  const {
    conversationId,
    otherUser,
    isGroup = false,
    groupName,
    participants = [],
  } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  /* TODO: replace 'me' fallback with real userId once auth stores it */
  const currentUserId = useSelector(state => state.auth.userId) ?? 'me';
  const messages = useSelector(
    state => state.chat.messages[conversationId] ?? [],
  );
  const isOtherTyping = useSelector(
    state => state.chat.typing[conversationId] ?? false,
  );

  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  /* ── join room & load history ── */
  useEffect(() => {
    /* TODO: remove mock seed once backend is live */
    if (messages.length === 0 && MOCK_MESSAGES[conversationId]) {
      dispatch(
        setMessages({
          conversationId,
          messages: MOCK_MESSAGES[conversationId],
        }),
      );
    }

    socketService.emit('join_room', { conversationId });

    socketService.on('message_history', ({ messages: history }) => {
      dispatch(setMessages({ conversationId, messages: history }));
    });

    socketService.on('receive_message', ({ conversationId: cid, message }) => {
      if (cid !== conversationId) return;
      dispatch(appendMessage({ conversationId, message }));
    });

    socketService.on('typing', ({ conversationId: cid }) => {
      if (cid !== conversationId) return;
      dispatch(setTyping({ conversationId, isTyping: true }));
    });

    socketService.on('stop_typing', ({ conversationId: cid }) => {
      if (cid !== conversationId) return;
      dispatch(setTyping({ conversationId, isTyping: false }));
    });

    socketService.on('messages_read', ({ conversationId: cid }) => {
      if (cid !== conversationId) return;
      dispatch(markMessagesRead({ conversationId, userId: currentUserId }));
    });

    /* mark messages as read on open */
    socketService.emit('mark_read', { conversationId, userId: currentUserId });
    dispatch(markMessagesRead({ conversationId, userId: currentUserId }));

    return () => {
      socketService.emit('leave_room', { conversationId });
      socketService.off('message_history');
      socketService.off('receive_message');
      socketService.off('typing');
      socketService.off('stop_typing');
      socketService.off('messages_read');
    };
  }, [conversationId, currentUserId, dispatch]);

  /* ── typing events ── */
  const handleChangeText = useCallback(
    value => {
      setText(value);

      socketService.emit('typing', { conversationId, userId: currentUserId });

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        socketService.emit('stop_typing', {
          conversationId,
          userId: currentUserId,
        });
      }, 1500);
    },
    [conversationId, currentUserId],
  );

  /* ── send message ── */
  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const message = {
      _id: `${Date.now()}-${currentUserId}`,
      conversationId,
      senderId: currentUserId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      read: false,
    };

    socketService.emit('send_message', message);
    dispatch(appendMessage({ conversationId, message }));
    setText('');

    clearTimeout(typingTimer);
    socketService.emit('stop_typing', {
      conversationId,
      userId: currentUserId,
    });
  }, [text, conversationId, currentUserId, dispatch]);

  /* ── scroll to bottom on new message ── */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [messages.length]);

  /* ── render message bubble ── */
  const renderItem = useCallback(
    ({ item }) => {
      const isMine = item.senderId === currentUserId;
      return (
        <View
          style={[
            styles.bubbleRow,
            isMine ? styles.bubbleRowRight : styles.bubbleRowLeft,
          ]}
        >
          <View
            style={[
              styles.bubble,
              isMine ? styles.bubbleMine : styles.bubbleTheirs,
            ]}
          >
            {isGroup && !isMine && item.senderName && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
              {item.text}
            </Text>
            <View style={styles.bubbleMeta}>
              <Text
                style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}
              >
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {isMine && (
                <Icon
                  name={item.read ? 'done-all' : 'done'}
                  size={12}
                  color={item.read ? '#60A5FA' : 'rgba(255,255,255,0.7)'}
                  style={{ marginLeft: 3 }}
                />
              )}
            </View>
          </View>
        </View>
      );
    },
    [currentUserId],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Icon name="arrow-back" size={moderateScale(22)} color="#333" />
        </Pressable>
        <View
          style={[styles.headerAvatar, isGroup && styles.headerAvatarGroup]}
        >
          {isGroup ? (
            <Icon name="group" size={moderateScale(18)} color="#fff" />
          ) : (
            <Text style={styles.headerAvatarText}>
              {(otherUser?.name?.[0] ?? '?').toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>
            {isGroup ? groupName : otherUser?.name ?? t('chat_unknown_user')}
          </Text>
          {isGroup ? (
            <Text style={styles.headerSub}>
              {participants.length} {t('group_members')}
            </Text>
          ) : (
            isOtherTyping && (
              <Text style={styles.typingText}>{t('chat_typing')}</Text>
            )
          )}
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={handleChangeText}
            placeholder={t('chat_input_placeholder')}
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Icon name="send" size={moderateScale(20)} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
