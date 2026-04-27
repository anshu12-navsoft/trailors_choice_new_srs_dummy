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
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../../App/Redux/Slices/otpSlice';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/Login.styles';

const PHONE_LENGTH = { US: 10, CA: 10, IN: 10, CN: 11 };
const DEFAULT_LENGTH = 10;
const getMaxLength = cca2 => PHONE_LENGTH[cca2] ?? DEFAULT_LENGTH;

const Login = ({ navigation }) => {
  // In case of USA when production ready
  // const [country] = useState({ cca2: 'IN', callingCode: ['1'] });
  // In case of Testing by default india allowed
    const [country] = useState({ cca2: 'IN', callingCode: ['91'] });
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const { loading: otpLoading } = useSelector(state => state.otp);

  const callingCode = `+${country.callingCode?.[0] ?? '1'}`;
  const maxLength = getMaxLength(country.cca2);

  const handlePhoneChange = text => {
    const digits = text.replace(/\D/g, '').slice(0, maxLength);
    setPhone(digits);
  };

  const handleContinue = () => {
    if (phone.length < maxLength) {
      Alert.alert('Invalid number', `Please enter a valid ${maxLength}-digit phone number.`);
      return;
    }

    const mobile = parseInt(phone, 10);
    dispatch(sendOtp({ mobile, cc: callingCode })).then(result => {
      if (sendOtp.fulfilled.match(result)) {
        navigation.navigate('OtpVerification', {
          phoneNumber: `${callingCode}${phone}`,
          mobile,
          cc: callingCode,
          isNewUser: result.payload.isNewUser,
        });
      } else {
        Alert.alert('Error', result.payload || 'Failed to send OTP. Please try again.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Log in or Sign up</Text>
          <Text style={styles.label}>Phone number</Text>

          <View style={styles.inputRow}>
            <View style={styles.countryBtn}>
              <Text style={styles.callingCode}>{callingCode}</Text>
            </View>

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

          <CustomButton
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueBtn}
            loading={otpLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
