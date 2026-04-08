import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '../../../Components/TextInput/CustomTextInput';
import { verticalScale } from 'react-native-size-matters';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/ForgotPassword.styles';
const ForgotPassword = ({ navigation }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError(t('enter_email_or_mobile'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 🔁 Call API
      // await forgotPasswordAPI(value);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(t('reset_instructions_sent'), t('reset_instructions_sent_message'));

        navigation.navigate('EmailVerification', {
          identifier: value,
        });
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(t('something_went_wrong'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forgot_password_title')}</Text>

      <Text style={styles.subtitle}>
        {t('forgot_password_subtitle')}
      </Text>
      <View style={{ marginTop: verticalScale(40) }}>
        <CustomTextInput
          placeholder={t('email_or_mobile_placeholder')}
          label={t('email_or_mobile_label')}
          containerStyle={styles.inputSpacing}
          value={value}
          onChangeText={text => {
            setValue(text);
            setError('');
          }}
          autoCapitalize="none"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{ marginTop: verticalScale(10) }}>
        <CustomButton
          onPress={handleSubmit}
          disabled={loading}
          title={
            loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>{t('verify_email_button')}</Text>
            )
          }
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
