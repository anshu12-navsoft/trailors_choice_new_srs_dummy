import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../stylesheets/NewChat.style';
import { upsertConversation } from '../../../App/Redux/Slices/chatSlice';

/* TODO: replace with real users fetched from API */
export const MOCK_USERS = [
  { id: 'u2', name: 'Sarah Johnson' },
  { id: 'u3', name: 'Mike Torres' },
  { id: 'u4', name: 'Emily Chen' },
  { id: 'u5', name: 'David Kim' },
  { id: 'u6', name: 'Lisa Park' },
  { id: 'u7', name: 'James Wilson' },
];

const NewChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.chat.conversations);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const handleSelectUser = user => {
    /* reuse existing conversation if one already exists */
    const existing = conversations.find(
      c => !c.isGroup && c.otherUser?.id === user.id,
    );

    if (existing) {
      navigation.replace('Chat', {
        conversationId: existing.id,
        otherUser: existing.otherUser,
      });
      return;
    }

    /* create a new conversation locally */
    const newConv = {
      id: `conv_${user.id}`,
      otherUser: user,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isGroup: false,
    };
    dispatch(upsertConversation(newConv));

    navigation.replace('Chat', {
      conversationId: newConv.id,
      otherUser: user,
    });
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.row} onPress={() => handleSelectUser(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Icon name="chevron-right" size={moderateScale(20)} color="#ccc" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="arrow-back" size={moderateScale(22)} color="#333" />
        </Pressable>
        <Text style={styles.title}>{t('new_chat_title')}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Icon
          name="search"
          size={moderateScale(18)}
          color="#999"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t('chat_search_placeholder')}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          /* New Group option */
          <Pressable
            style={styles.groupRow}
            onPress={() => navigation.navigate('NewGroupChat')}
          >
            <View style={[styles.avatar, styles.groupAvatar]}>
              <Icon name="group" size={moderateScale(22)} color="#fff" />
            </View>
            <Text style={styles.groupLabel}>{t('new_group_title')}</Text>
            <Icon name="chevron-right" size={moderateScale(20)} color="#ccc" />
          </Pressable>
        }
      />
    </SafeAreaView>
  );
};

export default NewChatScreen;
