import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType,
  onSubmitEditing,
  onFocus,
  style,
  inputStyle,
}) => (
  <View style={style}>
    {label && (
      <Text style={styles.label}>{label}</Text>
    )}

    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      onFocus={onFocus}
      mode="outlined"
      error={!!error}
      left={leftIcon ? <TextInput.Icon icon={() => leftIcon} /> : undefined}
      right={rightIcon ? <TextInput.Icon icon={() => rightIcon} /> : undefined}
      style={styles.input}
      outlineStyle={styles.outline}
      contentStyle={inputStyle}
    />

    {(error || helperText) && (
      <HelperText type={error ? 'error' : 'info'} visible>
        {error || helperText}
      </HelperText>
    )}
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: moderateScale(6),
    color: '#374151',
  },
  input: {
    width: '100%',
    fontSize: moderateScale(15),
  },
  outline: {
    borderRadius: moderateScale(8),
  },
});

export default CustomTextInput;
