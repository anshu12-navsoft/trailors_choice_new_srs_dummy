import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';


export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#fff',
  },
  backBtn: { marginRight: moderateScale(8) },
  headerAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
  },
  headerAvatarGroup: { backgroundColor: '#7C3AED' },
  headerAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: moderateScale(16), fontWeight: '600', color: '#111' },
  headerSub: { fontSize: moderateScale(11), color: '#999', marginTop: 1 },
  typingText: { fontSize: moderateScale(11), color: '#22C55E', marginTop: 1 },

  messageList: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },

  bubbleRow: { marginVertical: moderateScale(3), flexDirection: 'row' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '75%',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(16),
  },
  bubbleMine: {
    backgroundColor: '#E53935',
    borderBottomRightRadius: moderateScale(4),
  },
  bubbleTheirs: {
    backgroundColor: '#F1F1F1',
    borderBottomLeftRadius: moderateScale(4),
  },
  senderName: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: moderateScale(14),
    color: '#333',
    lineHeight: moderateScale(20),
  },
  bubbleTextMine: { color: '#fff' },

  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  bubbleTime: { fontSize: moderateScale(10), color: '#999' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.7)' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#333',
    marginRight: moderateScale(8),
  },
  sendBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#ccc' },
});
