import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './NewGroupChat.style';
import {
  upsertConversation,
  setMessages,
} from '../../App/Redux/Slices/chatSlice';
import { MOCK_USERS } from './NewChatScreen';

const NewGroupChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState([]); // array of user ids

  const toggleUser = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert(t('new_group_title'), t('group_name_required'));
      return;
    }
    if (selected.length < 2) {
      Alert.alert(t('new_group_title'), t('group_min_members'));
      return;
    }

    const participants = MOCK_USERS.filter(u => selected.includes(u.id));
    const conversationId = `group_${Date.now()}`;

    const newGroup = {
      id: conversationId,
      isGroup: true,
      groupName: groupName.trim(),
      participants,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
    };

    dispatch(upsertConversation(newGroup));
    dispatch(setMessages({ conversationId, messages: [] }));

    navigation.replace('Chat', {
      conversationId,
      otherUser: null,
      isGroup: true,
      groupName: groupName.trim(),
      participants,
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <Pressable style={styles.row} onPress={() => toggleUser(item.id)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Icon name="check" size={14} color="#fff" />}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon name="arrow-back" size={moderateScale(22)} color="#333" />
        </Pressable>
        <Text style={styles.title}>{t('new_group_title')}</Text>
        <Pressable
          style={[
            styles.createBtn,
            selected.length < 2 && styles.createBtnDisabled,
          ]}
          onPress={handleCreate}
          disabled={selected.length < 2}
        >
          <Text style={styles.createBtnText}>{t('create_button')}</Text>
        </Pressable>
      </View>

      {/* Group name input */}
      <View style={styles.nameInputWrap}>
        <Icon
          name="group"
          size={moderateScale(20)}
          color="#999"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.nameInput}
          value={groupName}
          onChangeText={setGroupName}
          placeholder={t('group_name_placeholder')}
          placeholderTextColor="#999"
          maxLength={40}
        />
      </View>

      {/* Selected chips */}
      {selected.length > 0 && (
        <View style={styles.chips}>
          {selected.map(id => {
            const user = MOCK_USERS.find(u => u.id === id);
            return (
              <Pressable
                key={id}
                style={styles.chip}
                onPress={() => toggleUser(id)}
              >
                <Text style={styles.chipText}>{user?.name.split(' ')[0]}</Text>
                <Icon
                  name="close"
                  size={12}
                  color="#fff"
                  style={{ marginLeft: 4 }}
                />
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionLabel}>{t('group_add_members')}</Text>

      <FlatList
        data={MOCK_USERS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default NewGroupChatScreen;
