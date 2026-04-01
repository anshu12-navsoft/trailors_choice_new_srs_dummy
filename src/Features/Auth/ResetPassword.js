import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import OTPInput from '../../Components/Otp/OtpInput';
import CustomTextInput from '../../Components/TextInput/CustomTextInput';
import CustomButton from '../../Components/Buttons/CustomButton';
import { moderateScale, verticalScale } from 'react-native-size-matters';
const ResetPassword = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { identifier } = route.params || {};

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (password.length < 6) {
      setError(t('password_min_length'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('confirm_password_mismatch'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 🔁 Call reset password API
      // await resetPasswordAPI(identifier, otp, password);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(t('password_reset_success'), t('password_reset_message'));
        navigation.replace('Login');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Invalid OTP or expired request');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('reset_password_title')}</Text>

      <Text style={styles.subtitle}>{t('reset_password_subtitle')}</Text>

      {/* <View style={{ marginVertical: 20 }}>
        <OTPInput
          length={6}
          onComplete={code => {
            setOtp(code);
            setError('');
          }}
        />
      </View> */}
      <View style={{ marginTop: verticalScale(10) }}>
        <CustomTextInput
          placeholder={t('new_password_placeholder')}
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            setError('');
          }}
        />
      </View>

      <View style={{ marginTop: verticalScale(10) }}>
        <CustomTextInput
          placeholder={t('confirm_password_placeholder')}
          secureTextEntry
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            setError('');
          }}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{ marginTop: verticalScale(20) }}>
        <CustomButton
          title={
            loading ? <ActivityIndicator color="#FFF" /> : t('reset_password_button')
          }
          onPress={handleReset}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});
