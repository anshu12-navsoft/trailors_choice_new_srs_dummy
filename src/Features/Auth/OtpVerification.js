import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess } from '../../App/Redux/Slices/authSlice';
import CustomButton from '../../Components/Buttons/CustomButton';
import { styles } from './OtpVerification.styles';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OtpVerification = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { phoneNumber, isNewUser } = route.params || {};

  const inputRef = useRef(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code.');
      return;
    }
    try {
      setLoading(true);
      // TODO: call verify OTP API
      if (isNewUser) {
        // First time — mark phone as registered, go to Register
        await AsyncStorage.setItem(`USER_${phoneNumber}`, 'pending');
        navigation.navigate('Register', { phoneNumber });
      } else {
        // Returning user — go straight into the app
        await AsyncStorage.setItem('LAST_USER_ID', 'user_123');
        dispatch(loginSuccess());
      }
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp('');
    // TODO: call resend OTP API
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Confirm your number</Text>
          <Text style={styles.subtitle}>
            Enter the code we've sent via SMS to{' '}
            <Text style={styles.phone}>{phoneNumber}</Text>
          </Text>

          {/* OTP input box */}
          <Pressable style={styles.otpBox} onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View key={i} style={styles.otpSlot}>
                <Text style={styles.otpChar}>
                  {otp[i] ?? '-'}
                </Text>
              </View>
            ))}
            {/* Hidden real input */}
            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={v => setOtp(v.replace(/\D/g, '').slice(0, OTP_LENGTH))}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              style={styles.hiddenInput}
              caretHidden
              autoFocus
            />
          </Pressable>

          {/* Resend row */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Haven't received a code? </Text>
            <Pressable onPress={handleResend} disabled={!canResend}>
              <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                {canResend ? 'resend' : `resend in ${timer}s`}
              </Text>
            </Pressable>
          </View>

          <CustomButton
            title={loading ? 'Verifying…' : 'Continue'}
            onPress={handleVerify}
            variant="primary"
            size="large"
            disabled={loading}
            style={styles.continueBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerification;
