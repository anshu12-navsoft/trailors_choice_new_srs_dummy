import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/Login.styles';

// ─── REDUX WIRING (uncomment when backend is ready) ──────────────────────────
// import { useDispatch, useSelector } from 'react-redux';
// import { sendOtp } from '../../../App/Redux/Slices/otpSlice';
// ─────────────────────────────────────────────────────────────────────────────

/* ── Phone length rules per country code ───────────────────────────────── */
const PHONE_LENGTH = {
  // North America
  US: 10,
  CA: 10,

  // Asia Pacific
  IN: 10,
  CN: 11,
};
const DEFAULT_LENGTH = 10;

const getMaxLength = cca2 => PHONE_LENGTH[cca2] ?? DEFAULT_LENGTH;

const Login = ({ navigation }) => {
  const [country] = useState({ cca2: 'US', callingCode: ['1'] });
  const [phone, setPhone] = useState('');

  // ── REDUX HOOKS (uncomment when backend is ready) ─────────────────────────
  // const dispatch = useDispatch();
  // const { loading: otpLoading, error: otpError } = useSelector(state => state.otp);
  // ─────────────────────────────────────────────────────────────────────────

  const callingCode = `+${country.callingCode?.[0] ?? '1'}`;
  const maxLength = getMaxLength(country.cca2);

  const handlePhoneChange = text => {
    const digits = text.replace(/\D/g, '').slice(0, maxLength);
    setPhone(digits);
  };

  const handleContinue = async () => {
    if (phone.length < maxLength) {
      Alert.alert(
        'Invalid number',
        `Please enter a valid ${maxLength}-digit phone number.`,
      );
      return;
    }

    const fullPhone = `${callingCode}${phone}`;

    // ── CURRENT FLOW (local AsyncStorage, no backend) ─────────────────────
    const existing = await AsyncStorage.getItem(`USER_${fullPhone}`);
    navigation.navigate('OtpVerification', {
      phoneNumber: fullPhone,
      isNewUser: !existing,
    });
    // ─────────────────────────────────────────────────────────────────────

    // ── REDUX FLOW (uncomment when backend is ready, remove block above) ──
    // const result = await dispatch(sendOtp({ phoneNumber: fullPhone }));
    // if (sendOtp.fulfilled.match(result)) {
    //   navigation.navigate('OtpVerification', {
    //     phoneNumber: fullPhone,
    //     isNewUser: result.payload.isNewUser,
    //   });
    // } else {
    //   Alert.alert('Error', result.payload || 'Failed to send OTP. Please try again.');
    // }
    // ─────────────────────────────────────────────────────────────────────
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Log in or Sign up</Text>

          {/* Phone number label */}
          <Text style={styles.label}>Phone number</Text>

          {/* Input row */}
          <View style={styles.inputRow}>
            {/* Country code display */}
            <View style={styles.countryBtn}>
              <Text style={styles.callingCode}>{callingCode}</Text>
            </View>

            {/* Phone input */}
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Phone number"
              keyboardType="phone-pad"
              mode="outlined"
              maxLength={maxLength}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              contentStyle={styles.inputContent}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Continue */}
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueBtn}
            // loading={otpLoading}   // ← uncomment with Redux flow
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
