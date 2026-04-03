import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../Components/Buttons/CustomButton';
import colors from '../../Constants/Colors';
import StripeService, {
  formatCardNumber,
  formatExpiry,
  detectCardType,
} from '../../Services/stripe.payment.service';
import { styles } from './Payment.style';
const CARD_TYPE_LABELS = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  unknown: '',
};

const PaymentScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  // Pass { amount: 1999, currency: 'usd', description: 'Trail booking' }
  // via route.params when navigating to this screen.
  const {
    amount = 1000,
    currency = 'usd',
    description = 'Payment',
  } = route?.params ?? {};

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const cardType = detectCardType(cardNumber);
  const amountDisplay = `${currency.toUpperCase()} ${(amount / 100).toFixed(
    2,
  )}`;

  const handleCardNumberChange = text => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = text => {
    setExpiry(formatExpiry(text));
  };

  const handleCvcChange = text => {
    setCvc(text.replace(/\D/g, '').slice(0, 4));
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const result = await StripeService.processPayment(
        { number: cardNumber, expiry, cvc, name: cardName },
        amount,
        currency,
      );

      if (result.status === 'succeeded') {
        Alert.alert(
          t('payment_successful_title'),
          t('payment_successful_message', {
            amount: amountDisplay,
            id: result.id,
          }),
          [{ text: 'OK', onPress: () => navigation?.goBack() }],
        );
      } else if (result.status === 'requires_action') {
        Alert.alert(t('three_d_secure_required'), t('three_d_secure_message'));
      } else {
        Alert.alert('Payment Status', `Status: ${result.status}`);
      }
    } catch (error) {
      Alert.alert(t('payment_failed_title'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = field => [
    styles.input,
    focusedField === field && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('secure_payment_title')}</Text>
            <Text style={styles.headerSubtitle}>{description}</Text>
          </View>

          {/* Amount card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>{t('amount_due_label')}</Text>
            <Text style={styles.amountValue}>{amountDisplay}</Text>
          </View>

          {/* Card preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardPreviewTop}>
              <Text style={styles.cardPreviewBank}>Trailors</Text>
              {cardType !== 'unknown' && (
                <Text style={styles.cardTypeLabel}>
                  {CARD_TYPE_LABELS[cardType]}
                </Text>
              )}
            </View>
            <Text style={styles.cardPreviewNumber}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
            <View style={styles.cardPreviewBottom}>
              <View>
                <Text style={styles.cardPreviewHint}>CARDHOLDER</Text>
                <Text style={styles.cardPreviewValue}>
                  {cardName || 'YOUR NAME'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardPreviewHint}>EXPIRES</Text>
                <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>{t('cardholder_name_label')}</Text>
            <TextInput
              style={inputStyle('name')}
              placeholder={t('cardholder_name_placeholder')}
              placeholderTextColor={colors.textDisabled}
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={styles.label}>{t('card_number_label')}</Text>
            <TextInput
              style={inputStyle('number')}
              placeholder={t('card_number_placeholder')}
              placeholderTextColor={colors.textDisabled}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="number-pad"
              maxLength={19}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>{t('expiry_date_label')}</Text>
                <TextInput
                  style={inputStyle('expiry')}
                  placeholder={t('expiry_placeholder')}
                  placeholderTextColor={colors.textDisabled}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                  keyboardType="number-pad"
                  maxLength={5}
                  onFocus={() => setFocusedField('expiry')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>{t('cvc_label')}</Text>
                <TextInput
                  style={inputStyle('cvc')}
                  placeholder={cardType === 'amex' ? '••••' : '•••'}
                  placeholderTextColor={colors.textDisabled}
                  value={cvc}
                  onChangeText={handleCvcChange}
                  keyboardType="number-pad"
                  maxLength={cardType === 'amex' ? 4 : 3}
                  secureTextEntry
                  onFocus={() => setFocusedField('cvc')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          </View>

          {/* Pay button */}
          <CustomButton
            title={t('pay_button', { amount: amountDisplay })}
            onPress={handlePay}
            loading={loading}
            disabled={loading}
            size="large"
            style={styles.payButton}
          />

          <Text style={styles.secureNote}>{t('secured_by_stripe')}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentScreen;
