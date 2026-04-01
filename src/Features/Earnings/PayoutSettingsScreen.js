import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const PayoutSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const PAYOUT_SCHEDULES = [
    { label: t('weekly_schedule'), value: 'weekly', desc: t('weekly_schedule_desc') },
    { label: t('biweekly_schedule'), value: 'biweekly', desc: t('biweekly_schedule_desc') },
    { label: t('monthly_schedule'), value: 'monthly', desc: t('monthly_schedule_desc') },
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
      Alert.alert(t('profile_saved'), 'Payout settings have been updated successfully.');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payout_settings_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Current Payout Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Icon name="account-balance-wallet" size={moderateScale(20)} color={colors.success} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>{t('next_payout_amount')}</Text>
              <Text style={styles.summaryAmount}>$666</Text>
              <Text style={styles.summaryDate}>{t('payout_scheduled', { date: 'Apr 1, 2025' })}</Text>
            </View>
          </View>
        </View>

        {/* Bank Account */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{t('bank_account_section')}</Text>
            <TouchableOpacity onPress={() => setEditingBank(!editingBank)}>
              <Text style={styles.editLink}>{editingBank ? t('cancel_button') : t('edit_link')}</Text>
            </TouchableOpacity>
          </View>

          {!editingBank ? (
            <View style={styles.bankDisplay}>
              <View style={styles.bankIconRow}>
                <Icon name="account-balance" size={moderateScale(24)} color={colors.primary} />
                <View>
                  <Text style={styles.bankName}>{bankName}</Text>
                  <Text style={styles.bankAccount}>{t('account_ending_in', { last_digits: '4821' })}</Text>
                </View>
              </View>
              <View style={styles.verifiedRow}>
                <Icon name="verified" size={moderateScale(14)} color={colors.success} />
                <Text style={styles.verifiedText}>{t('account_verified')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.bankForm}>
              <Text style={styles.fieldLabel}>{t('account_holder_name_label')}</Text>
              <TextInput style={styles.input} value={accountHolder} onChangeText={setAccountHolder} />

              <Text style={styles.fieldLabel}>{t('bank_name_label')}</Text>
              <TextInput style={styles.input} value={bankName} onChangeText={setBankName} />

              <Text style={styles.fieldLabel}>{t('account_number_label')}</Text>
              <TextInput style={styles.input} value={accountNumber} onChangeText={setAccountNumber} keyboardType="numeric" secureTextEntry />

              <Text style={styles.fieldLabel}>{t('routing_number_label')}</Text>
              <TextInput style={styles.input} value={routingNumber} onChangeText={setRoutingNumber} keyboardType="numeric" />

              <View style={styles.encryptionNote}>
                <Icon name="lock" size={moderateScale(14)} color={colors.success} />
                <Text style={styles.encryptionText}>{t('banking_details_encrypted')}</Text>
              </View>

              <TouchableOpacity style={styles.saveAccountBtn} onPress={() => { setEditingBank(false); Alert.alert(t('profile_saved'), 'Bank account updated.'); }}>
                <Text style={styles.saveAccountBtnText}>{t('save_bank_account_button')}</Text>
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
              <View style={[styles.radio, schedule === opt.value && styles.radioActive]}>
                {schedule === opt.value && <View style={styles.radioInner} />}
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={[styles.scheduleLabel, schedule === opt.value && { color: colors.primary, fontWeight: '700' }]}>{opt.label}</Text>
                <Text style={styles.scheduleDesc}>{opt.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Commission Info */}
        <View style={styles.infoCard}>
          <Icon name="info-outline" size={moderateScale(18)} color={colors.primary} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>{t('platform_commission_section')}</Text>
            <Text style={styles.infoDesc}>{t('platform_commission_info')}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? t('saving_text') : t('save_settings_button')}</Text>
        </TouchableOpacity>

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: 12, borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  content: { padding: moderateScale(16), gap: 12 },
  summaryCard: { backgroundColor: '#F0FDF4', borderRadius: moderateScale(14), padding: moderateScale(16), borderWidth: 1, borderColor: '#BBF7D0' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontSize: moderateScale(12), color: colors.textSecondary, fontWeight: '600' },
  summaryAmount: { fontSize: moderateScale(28), fontWeight: '900', color: colors.success },
  summaryDate: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  card: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), borderWidth: 1, borderColor: colors.border },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(12) },
  cardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary },
  editLink: { fontSize: moderateScale(14), color: colors.primary, fontWeight: '600' },
  bankDisplay: { gap: 10 },
  bankIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bankName: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary },
  bankAccount: { fontSize: moderateScale(13), color: colors.textSecondary, marginTop: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifiedText: { fontSize: moderateScale(12), color: colors.success, fontWeight: '600' },
  bankForm: { gap: 4 },
  fieldLabel: { fontSize: moderateScale(13), fontWeight: '600', color: colors.textPrimary, marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(10), paddingHorizontal: moderateScale(12), height: moderateScale(46), fontSize: moderateScale(14), color: colors.textPrimary, backgroundColor: '#fff' },
  encryptionNote: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', borderRadius: 8, padding: 8, marginTop: 8 },
  encryptionText: { flex: 1, fontSize: moderateScale(12), color: colors.textSecondary },
  saveAccountBtn: { backgroundColor: colors.primary, borderRadius: moderateScale(10), paddingVertical: moderateScale(12), alignItems: 'center', marginTop: 12 },
  saveAccountBtnText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
  scheduleOption: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: moderateScale(12), borderBottomWidth: 1, borderColor: colors.border },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  scheduleInfo: { flex: 1 },
  scheduleLabel: { fontSize: moderateScale(14), color: colors.textPrimary },
  scheduleDesc: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#EFF6FF', borderRadius: moderateScale(12), padding: moderateScale(14), borderWidth: 1, borderColor: '#BFDBFE' },
  infoText: { flex: 1 },
  infoTitle: { fontSize: moderateScale(13), fontWeight: '700', color: colors.primary, marginBottom: 4 },
  infoDesc: { fontSize: moderateScale(12), color: colors.textSecondary, lineHeight: 18 },
  saveBtn: { backgroundColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(14), alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '700' },
});

export default PayoutSettingsScreen;
