import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const CustomDropdown = ({
  label,
  placeholder,
  value,
  options = [], // [{ label, value }]
  onSelect,
  leftIcon,
  error,
  style,
}) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const resolvedPlaceholder = placeholder ?? t('select_option_placeholder');
  const isLandscape = width > height;

  const selectedLabel = options.find(item => item.value === value)?.label;

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Dropdown Trigger */}
      <Pressable
        style={[styles.trigger, error && styles.errorBorder]}
        onPress={() => setVisible(true)}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <Text style={[styles.valueText, !selectedLabel && styles.placeholder]}>
          {selectedLabel || resolvedPlaceholder}
        </Text>

        <Text style={styles.arrow}>⌄</Text>
      </Pressable>

      {/* Error text */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    marginBottom: moderateScale(6),
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#374151',
  },

  trigger: {
    minHeight: moderateScale(48),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  valueText: {
    flex: 1,
    fontSize: moderateScale(15),
    color: '#111827',
  },

  placeholder: {
    color: '#9CA3AF',
  },

  arrow: {
    fontSize: moderateScale(16),
    color: '#6B7280',
    marginLeft: moderateScale(6),
  },

  icon: {
    marginRight: moderateScale(8),
  },

  errorText: {
    marginTop: moderateScale(4),
    fontSize: moderateScale(12),
    color: '#DC2626',
  },

  errorBorder: {
    borderColor: '#DC2626',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: moderateScale(16),
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(14),
    maxHeight: '70%',
    overflow: 'hidden',
  },

  option: {
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  optionText: {
    fontSize: moderateScale(15),
    color: '#111827',
  },
});

export default CustomDropdown;
