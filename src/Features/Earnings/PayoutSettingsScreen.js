import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';
import { styles } from './PayoutSettings.style';
const PayoutSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();

  const PAYOUT_SCHEDULES = [
    {
      label: t('weekly_schedule'),
      value: 'weekly',
      desc: t('weekly_schedule_desc'),
    },
    {
      label: t('biweekly_schedule'),
      value: 'biweekly',
      desc: t('biweekly_schedule_desc'),
    },
    {
      label: t('monthly_schedule'),
      value: 'monthly',
      desc: t('monthly_schedule_desc'),
    },
  ];
  const [accountHolder, setAccountHolder] = useState('John Doe');
  const [bankName, setBankName] = useState('Chase Bank');
  const [accountNumber, setAccountNumber] = useState('••••••••4821');
  const [routingNumber, setRoutingNumber] = useState('021000021');
  const [schedule, setSchedule] = useState('weekly');
  const [editingBank, setEditingBank] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        t('profile_saved'),
        'Payout settings have been updated successfully.',
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon
            name="arrow-back"
            size={moderateScale(22)}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payout_settings_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Payout Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Icon
              name="account-balance-wallet"
              size={moderateScale(20)}
              color={colors.success}
            />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>{t('next_payout_amount')}</Text>
              <Text style={styles.summaryAmount}>$666</Text>
              <Text style={styles.summaryDate}>
                {t('payout_scheduled', { date: 'Apr 1, 2025' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank Account */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{t('bank_account_section')}</Text>
            <TouchableOpacity onPress={() => setEditingBank(!editingBank)}>
              <Text style={styles.editLink}>
                {editingBank ? t('cancel_button') : t('edit_link')}
              </Text>
            </TouchableOpacity>
          </View>

          {!editingBank ? (
            <View style={styles.bankDisplay}>
              <View style={styles.bankIconRow}>
                <Icon
                  name="account-balance"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.bankName}>{bankName}</Text>
                  <Text style={styles.bankAccount}>
                    {t('account_ending_in', { last_digits: '4821' })}
                  </Text>
                </View>
              </View>
              <View style={styles.verifiedRow}>
                <Icon
                  name="verified"
                  size={moderateScale(14)}
                  color={colors.success}
                />
                <Text style={styles.verifiedText}>{t('account_verified')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.bankForm}>
              <Text style={styles.fieldLabel}>
                {t('account_holder_name_label')}
              </Text>
              <TextInput
                style={styles.input}
                value={accountHolder}
                onChangeText={setAccountHolder}
              />

              <Text style={styles.fieldLabel}>{t('bank_name_label')}</Text>
              <TextInput
                style={styles.input}
                value={bankName}
                onChangeText={setBankName}
              />

              <Text style={styles.fieldLabel}>{t('account_number_label')}</Text>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                secureTextEntry
              />

              <Text style={styles.fieldLabel}>{t('routing_number_label')}</Text>
              <TextInput
                style={styles.input}
                value={routingNumber}
                onChangeText={setRoutingNumber}
                keyboardType="numeric"
              />

              <View style={styles.encryptionNote}>
                <Icon
                  name="lock"
                  size={moderateScale(14)}
                  color={colors.success}
                />
                <Text style={styles.encryptionText}>
                  {t('banking_details_encrypted')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.saveAccountBtn}
                onPress={() => {
                  setEditingBank(false);
                  Alert.alert(t('profile_saved'), 'Bank account updated.');
                }}
              >
                <Text style={styles.saveAccountBtnText}>
                  {t('save_bank_account_button')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payout Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('payout_schedule_section')}</Text>
          {PAYOUT_SCHEDULES.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={styles.scheduleOption}
              onPress={() => setSchedule(opt.value)}
            >
              <View
                style={[
                  styles.radio,
                  schedule === opt.value && styles.radioActive,
                ]}
              >
                {schedule === opt.value && <View style={styles.radioInner} />}
              </View>
              <View style={styles.scheduleInfo}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    schedule === opt.value && {
                      color: colors.primary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={styles.scheduleDesc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Commission Info */}
        <View style={styles.infoCard}>
          <Icon
            name="info-outline"
            size={moderateScale(18)}
            color={colors.primary}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              {t('platform_commission_section')}
            </Text>
            <Text style={styles.infoDesc}>{t('platform_commission_info')}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? t('saving_text') : t('save_settings_button')}
          </Text>
        </TouchableOpacity>

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PayoutSettingsScreen;
