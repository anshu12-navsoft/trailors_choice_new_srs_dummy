import { useState } from 'react';
import { Platform } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const formatDate = (d, mode) => {
  if (!d) return '';

  const day     = d.getDate().toString().padStart(2, '0');
  const month   = (d.getMonth() + 1).toString().padStart(2, '0');
  const year    = d.getFullYear();
  const hours   = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  if (mode === 'date') return `${day}/${month}/${year}`;
  if (mode === 'time') return `${hours}:${minutes}`;
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const DateTimePicker = ({
  label = 'Select Date',
  onDateChange,
  minimumDate,
  maximumDate,
  placeholder = 'Select...',
  mode = 'datetime',
  style,
}) => {
  const { colors } = useTheme();
  const [date, setDate] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = selectedDate => {
    setDate(selectedDate);
    setPickerVisible(false);
    onDateChange?.(selectedDate);
  };

  return (
    <>
      <TextInput
        label={label}
        value={date ? formatDate(date, mode) : ''}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceDisabled}
        onPressIn={() => setPickerVisible(true)}
        showSoftInputOnFocus={false}
        editable
        mode="outlined"
        right={<TextInput.Icon icon="calendar" onPress={() => setPickerVisible(true)} />}
        style={style}
      />

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        is24Hour
      />
    </>
  );
};

export default DateTimePicker;
