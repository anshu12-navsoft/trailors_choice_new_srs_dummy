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

import { upsertConversation, setMessages } from '../../App/Redux/Slices/chatSlice';
import { MOCK_USERS } from './NewChatScreen';

const NewGroupChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState([]); // array of user ids

  const toggleUser = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
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
          style={[styles.createBtn, selected.length < 2 && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={selected.length < 2}
        >
          <Text style={styles.createBtnText}>{t('create_button')}</Text>
        </Pressable>
      </View>

      {/* Group name input */}
      <View style={styles.nameInputWrap}>
        <Icon name="group" size={moderateScale(20)} color="#999" style={{ marginRight: 10 }} />
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
              <Pressable key={id} style={styles.chip} onPress={() => toggleUser(id)}>
                <Text style={styles.chipText}>{user?.name.split(' ')[0]}</Text>
                <Icon name="close" size={12} color="#fff" style={{ marginLeft: 4 }} />
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: moderateScale(12),
  },
  title: { flex: 1, fontSize: moderateScale(18), fontWeight: '600', color: '#111' },
  createBtn: {
    backgroundColor: '#E53935',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  createBtnDisabled: { backgroundColor: '#ccc' },
  createBtnText: { color: '#fff', fontWeight: '600', fontSize: moderateScale(13) },

  nameInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(10),
    height: moderateScale(44),
  },
  nameInput: { flex: 1, fontSize: moderateScale(14), color: '#333' },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(8),
    gap: moderateScale(6),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  chipText: { color: '#fff', fontSize: moderateScale(12), fontWeight: '500' },

  sectionLabel: {
    fontSize: moderateScale(12),
    color: '#999',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  avatar: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },
  name: { flex: 1, fontSize: moderateScale(15), color: '#222' },

  checkbox: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#E53935', borderColor: '#E53935' },

  separator: { height: 1, backgroundColor: '#F5F5F5', marginLeft: moderateScale(72) },
});

export default NewGroupChatScreen;
