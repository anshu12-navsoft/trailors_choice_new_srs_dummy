import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { verticalScale } from 'react-native-size-matters';
import CustomButton from '../../Components/Buttons/CustomButton';
import { styles } from './EmailVerification.styles';
const EmailVerification = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { email } = route.params || {};
  const [loading, setLoading] = useState(false);

  const maskEmail = email => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const maskedName =
      name.length > 2 ? name.substring(0, 2) + '***' : name[0] + '*';
    return `${maskedName}@${domain}`;
  };

  const handleResend = async () => {
    try {
      setLoading(true);

      // 🔁 Call your resend email API here
      // await resendEmailVerificationAPI(email);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(t('email_sent_success'), t('email_resent_message'));
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert(t('email_send_failed'), t('email_send_failed_message'));
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);

      // 🔁 Call API to check if email verified
      // const res = await checkEmailVerificationStatus();

      setTimeout(() => {
        setLoading(false);

        // Simulated success
        navigation.replace('OtpVerification');
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert(t('email_not_verified'), t('email_not_verified_message'));
    }
  };

  const openEmailApp = () => {
    Linking.openURL('mailto:');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('verify_your_email_title')}</Text>

      <Text style={styles.subtitle}>{t('verify_email_subtitle')}</Text>

      <Text style={styles.email}>{maskEmail(email)}</Text>

      <Text style={styles.info}>{t('email_verification_instructions')}</Text>
      <View style={{ marginTop: verticalScale(10) }}>
        <CustomButton
          title={t('open_email_app_button')}
          onPress={openEmailApp}
        />
      </View>
      <View style={{ marginTop: verticalScale(10) }}>
        <CustomButton
          onPress={handleCheckVerification}
          disabled={loading}
          title={
            loading ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <Text style={styles.secondaryButtonText}>
                {t('email_verified')}
              </Text>
            )
          }
        />
      </View>

      <CustomButton
        title={t('didnt_receive_email')}
        onPress={handleResend}
        variant="outline"
        style={{
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        }}
        textStyle={styles.resendText}
      />
      <CustomButton
        title={t('change_email_address')}
        onPress={() => navigation.goBack()}
        variant="outline"
        style={{
          marginTop: 20,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        }}
        textStyle={styles.changeEmailText}
      />
    </View>
  );
};

export default EmailVerification;
