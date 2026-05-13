// src/components/AppFlash.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlashMessage, { hideMessage, showMessage } from 'react-native-flash-message';

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useFlash = () => ({
  success: (message, description, overrides) =>
    showMessage({ type: 'success', title: message, description, icon: 'none', ...overrides }),
  error: (message, description, overrides) =>
    showMessage({ type: 'danger', title: message, description, icon: 'none', ...overrides }),
  warning: (message, description, overrides) =>
    showMessage({ type: 'warning', title: message, description, icon: 'none', ...overrides }),
  info: (message, description, overrides) =>
    showMessage({ type: 'info', title: message, description, icon: 'none', ...overrides }),
  show: (options) => showMessage(options),
  hide: () => hideMessage(),
});

// ─── Per-type visual config ───────────────────────────────────────────────────
const TYPE_CONFIG = {
  danger:  { icon: '🚫', bg: '#FEF0F0', border: '#FDDCDC', iconColor: '#E53E3E', textColor: '#555', closeColor: '#AAA' },
  success: { icon: '✅', bg: '#F0FDF4', border: '#BBF7D0', iconColor: '#16A34A', textColor: '#555', closeColor: '#AAA' },
  warning: { icon: '⚠️', bg: '#FFFBEB', border: '#FDE68A', iconColor: '#D97706', textColor: '#555', closeColor: '#AAA' },
  info:    { icon: 'ℹ️', bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#2563EB', textColor: '#555', closeColor: '#AAA' },
  default: { icon: '•',  bg: '#F9FAFB', border: '#E5E7EB', iconColor: '#6B7280', textColor: '#555', closeColor: '#AAA' },
};

// ─── Custom card ──────────────────────────────────────────────────────────────
const CustomFlashCard = ({ message }) => {
  const cfg = TYPE_CONFIG[message.type] || TYPE_CONFIG.default;
  const text = message.description || message.title || '';

  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Text style={[styles.icon, { color: cfg.iconColor }]}>{cfg.icon}</Text>
      <Text style={[styles.message, { color: cfg.textColor }]} numberOfLines={3}>{text}</Text>
      <TouchableOpacity onPress={hideMessage} hitSlop={10}>
        <Text style={[styles.close, { color: cfg.closeColor }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Host component — add once at your app root ───────────────────────────────
const CustomSnackBar = () => (
  <FlashMessage
    position="top"
    floating={true}
    duration={4000}
    animationDuration={300}
    hideStatusBar={false}
    MessageComponent={CustomFlashCard}
  />
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  icon:    { fontSize: 18 },
  message: { flex: 1, fontSize: 15, lineHeight: 20 },
  close:   { fontSize: 14 },
});

export default CustomSnackBar;


// Any screen — import the hook from the same file:
// jsimport { useFlash } from './src/components/AppFlash';

// const flash = useFlash();
// flash.error('Invalid username or password.');
// flash.success('Logged in!');