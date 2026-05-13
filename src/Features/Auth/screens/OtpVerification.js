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
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, resetOtp } from '../../../App/Redux/Slices/otpSlice';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/OtpVerification.styles';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OtpVerification = ({ navigation, route }) => {
  const { phoneNumber, mobile, cc } = route.params || {};

  const inputRef = useRef(null);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.otp);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code.');
      return;
    }

    dispatch(verifyOtp({ mobile, otp: parseInt(otp, 10), cc })).then(result => {
      console.log('verifyOtp result:', JSON.stringify(result, null, 2));
      if (verifyOtp.fulfilled.match(result)) {
        const { isNewUser, hasDocuments, userId: resolvedUserId } = result.payload;
        console.log('OTP verified ✅ | isNewUser:', isNewUser, '| hasDocuments:', hasDocuments);
        dispatch(resetOtp());
        if (isNewUser) {
          navigation.navigate('Register', { phoneNumber, userId: resolvedUserId });
        } else if (!hasDocuments) {
          navigation.navigate('AccountSettings', { userId: resolvedUserId });
        } else {
          dispatch(loginSuccess());
        }
      } else {
        console.log('OTP verify failed ❌:', result.payload);
        Alert.alert('Error', result.payload || 'Invalid OTP. Please try again.');
      }
    });
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp('');
    dispatch(resendOtp({ mobile, cc }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          testID="back-btn"
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Confirm your number</Text>
          <Text style={styles.subtitle}>
            Enter the code we've sent via SMS to{' '}
            <Text style={styles.phone}>{phoneNumber}</Text>
          </Text>

          <Pressable
            style={styles.otpBox}
            onPress={() => inputRef.current?.focus()}
          >
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View key={i} style={styles.otpSlot}>
                <Text style={styles.otpChar}>{otp[i] ?? '-'}</Text>
              </View>
            ))}
            <TextInput
              testID="otp-input"
              ref={inputRef}
              value={otp}
              onChangeText={v =>
                setOtp(v.replace(/\D/g, '').slice(0, OTP_LENGTH))
              }
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              style={styles.hiddenInput}
              caretHidden
              autoFocus
            />
          </Pressable>

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Haven't received a code? </Text>
            <Pressable onPress={handleResend} disabled={!canResend}>
              <Text
                style={[styles.resendLink, !canResend && styles.resendDisabled]}
              >
                {canResend ? 'resend' : `resend in ${timer}s`}
              </Text>
            </Pressable>
          </View>

          <CustomButton
            testID="continue-btn"
            title="Continue"
            onPress={handleVerify}
            variant="primary"
            size="large"
            loading={loading}
            style={styles.continueBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerification;
