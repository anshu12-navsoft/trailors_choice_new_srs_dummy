import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../Constants/Colors';
import { styles } from '../stylesheets/PaymentMethod.style';
import CustomHeader from '../../../Components/Header/CustomHeader';

import { List, Divider } from 'react-native-paper';
import CustomButton from '../../../Components/Buttons/CustomButton';
import CustomTextInput from '../../../Components/TextInput/CustomTextInput';

const PaymentMethodScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const booking = route.params?.booking ?? {};
  const [expanded, setExpanded] = useState('cards');

  const handleToggle = section => {
    setExpanded(expanded === section ? null : section);
  };

  const ICONS = {
    cards: 'credit-card-outline',
    netbanking: 'bank-outline',
    wallet: 'wallet-outline',
    payLater: 'clock-outline',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader onBack={() => navigation.goBack()} />
      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(10),
        }}
      >
        <Text style={styles.footerTotal}>Payment Method</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.screen}>
          <View style={styles.card}>
            {/* Cards Header */}
            <View style={styles.headerRow}>
              <View style={styles.leftRow}>
                <Icon name="credit-card-outline" size={20} color="#2563EB" />
                <Text style={styles.headerText}>Cards</Text>
              </View>
              <Icon name="chevron-up" size={20} color="#111827" />
            </View>

            {/* Form */}
            <View style={styles.form}>
              <CustomTextInput
                label={t('Card Number')}
                placeholder="1234 1234 1234 1234"
                // value={form.year}
                // onChangeText={v => setForm(f => ({ ...f, year: v }))}
                keyboardType="number-pad"
              />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <CustomTextInput
                    label={t('Expiry Date')}
                    placeholder="MM / YY"
                    // value={form.year}
                    // onChangeText={v => setForm(f => ({ ...f, year: v }))}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <CustomTextInput
                    label={t('Security Code')}
                    placeholder="CVV"
                    // value={form.year}
                    // onChangeText={v => setForm(f => ({ ...f, year: v }))}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <CustomTextInput
                label={t('Name on Card')}
                placeholder="Michael Jordan"
                // value={form.year}
                // onChangeText={v => setForm(f => ({ ...f, year: v }))}
                keyboardType="number-pad"
              />
            </View>

            <Divider />

            {/* Netbanking */}
            <Pressable style={styles.itemRow}>
              <View style={styles.leftRow}>
                <Icon name="bank-outline" size={20} color="#2563EB" />
                <Text style={styles.itemText}>Netbanking</Text>
              </View>
              <Icon name="chevron-down" size={20} color="#111827" />
            </Pressable>

            <Divider />

            {/* Wallet */}
            <Pressable style={styles.itemRow}>
              <View style={styles.leftRow}>
                <Icon name="wallet-outline" size={20} color="#2563EB" />
                <Text style={styles.itemText}>Wallet</Text>
              </View>
              <Icon name="chevron-down" size={20} color="#111827" />
            </Pressable>

            <Divider />

            {/* Pay Later */}
            <Pressable style={styles.itemRow}>
              <View style={styles.leftRow}>
                <Icon name="clock-outline" size={20} color="#2563EB" />
                <Text style={styles.itemText}>Pay Later</Text>
              </View>
              <Icon name="chevron-down" size={20} color="#111827" />
            </Pressable>
          </View>
        </View>
        <View style={{ height: verticalScale(50) }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <CustomButton
          onPress={() => {
            navigation.navigate('BookingConfirmation');
          }}
          title={'Pay $350.12'}
          size="medium"
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;
