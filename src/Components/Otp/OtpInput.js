import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={ref => (inputs.current[index] = ref)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={value}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          autoFocus={index === 0}
          textAlign="center"
          selectionColor="#000"
          importantForAutofill="no"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    fontSize: 20,
  },
});
export default OTPInput;
