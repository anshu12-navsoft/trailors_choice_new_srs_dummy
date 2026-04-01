import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const MONTHLY_DATA = [
  { month: 'Nov', amount: 620 },
  { month: 'Dec', amount: 890 },
  { month: 'Jan', amount: 340 },
  { month: 'Feb', amount: 1120 },
  { month: 'Mar', amount: 820 },
];

const EARNINGS_LIST = [
  { id: 'B001', renterName: 'Alex J.', trailerName: 'Heavy Duty Flatbed', dates: 'Mar 22–24', gross: 170, fee: 20, net: 150, status: 'paid', depositReleased: true },
  { id: 'B002', renterName: 'Maria L.', trailerName: 'Enclosed Cargo 7x14', dates: 'Mar 28–Apr 1', gross: 440, fee: 44, net: 396, status: 'pending', depositReleased: false },
  { id: 'B003', renterName: 'Chris P.', trailerName: 'Dump Trailer 14ft', dates: 'Apr 5–7', gross: 300, fee: 30, net: 270, status: 'pending', depositReleased: false },
  { id: 'B004', renterName: 'Sandra K.', trailerName: 'Heavy Duty Flatbed', dates: 'Mar 10–12', gross: 170, fee: 20, net: 150, status: 'paid', depositReleased: true },
  { id: 'B005', renterName: 'Tom W.', trailerName: 'Enclosed Cargo 7x14', dates: 'Mar 5–6', gross: 110, fee: 11, net: 99, status: 'paid', depositReleased: true },
  { id: 'B006', renterName: 'Jennifer B.', trailerName: 'Dump Trailer 14ft', dates: 'Feb 20–23', gross: 450, fee: 45, net: 405, status: 'paid', depositReleased: true },
];

const EarningsRow = ({ item }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.earningRow}>
      <View style={styles.earningLeft}>
        <Text style={styles.earningRenter}>{item.renterName}</Text>
        <Text style={styles.earningTrailer} numberOfLines={1}>{item.trailerName}</Text>
        <Text style={styles.earningDates}>{item.dates}</Text>
      </View>
      <View style={styles.earningRight}>
        <Text style={styles.earningNet}>${item.net}</Text>
        <View style={[styles.payoutBadge, { backgroundColor: item.status === 'paid' ? '#DCFCE7' : '#FEF9C3' }]}>
          <Text style={[styles.payoutBadgeText, { color: item.status === 'paid' ? colors.success : '#92400E' }]}>
            {item.status === 'paid' ? t('paid_status') : t('pending_status')}
          </Text>
        </View>
        {item.depositReleased && (
          <Text style={styles.depositTag}>{t('deposit_released')}</Text>
        )}
      </View>
    </View>
  );
};

const EarningsDashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const PERIOD_TABS = [t('this_month_label'), t('last_month_label'), 'All Time'];
  const [activePeriod, setActivePeriod] = useState(PERIOD_TABS[0]);

  const maxBar = Math.max(...MONTHLY_DATA.map(d => d.amount));

  const totalEarned = EARNINGS_LIST.reduce((s, e) => s + e.net, 0);
  const pendingAmount = EARNINGS_LIST.filter(e => e.status === 'pending').reduce((s, e) => s + e.net, 0);
  const paidAmount = EARNINGS_LIST.filter(e => e.status === 'paid').reduce((s, e) => s + e.net, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('earnings_dashboard_title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PayoutSettings')}>
          <Icon name="settings" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.summaryLabel}>{t('total_earned_label')}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>${totalEarned.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.summaryLabel}>{t('paid_out_label')}</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>${paidAmount.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.summaryLabel}>{t('pending_label')}</Text>
            <Text style={[styles.summaryValue, { color: '#92400E' }]}>${pendingAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Next Payout Card */}
        <View style={styles.nextPayoutCard}>
          <View>
            <Text style={styles.nextPayoutLabel}>{t('next_payout_label')}</Text>
            <Text style={styles.nextPayoutAmount}>${pendingAmount}</Text>
            <Text style={styles.nextPayoutDate}>{t('expected_payout', { date: 'Apr 1, 2025', schedule: t('weekly_schedule') })}</Text>
          </View>
          <TouchableOpacity style={styles.payoutSettingsBtn} onPress={() => navigation.navigate('PayoutSettings')}>
            <Icon name="account-balance" size={moderateScale(16)} color={colors.primary} />
            <Text style={styles.payoutSettingsText}>{t('payout_settings_label')}</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Chart */}
        <Text style={styles.sectionTitle}>{t('monthly_revenue_section')}</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {MONTHLY_DATA.map(item => (
              <View key={item.month} style={styles.barItem}>
                <Text style={styles.barAmount}>${item.amount}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, {
                    height: (item.amount / maxBar) * moderateScale(80),
                    backgroundColor: item.month === 'Mar' ? colors.primary : '#BFDBFE',
                  }]} />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Period Tabs */}
        <View style={styles.periodTabs}>
          {PERIOD_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.periodTab, activePeriod === tab && styles.periodTabActive]}
              onPress={() => setActivePeriod(tab)}
            >
              <Text style={[styles.periodTabText, activePeriod === tab && styles.periodTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings List */}
        <Text style={styles.sectionTitle}>{t('booking_earnings_section')}</Text>
        {EARNINGS_LIST.map(item => (
          <EarningsRow key={item.id} item={item} />
        ))}

        {/* Download Statement */}
        <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Download', t('download_statement_message'))}>
          <Icon name="download" size={moderateScale(18)} color={colors.primary} />
          <Text style={styles.downloadBtnText}>{t('download_statement_button')}</Text>
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
  headerTitle: { flex: 1, fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  content: { padding: moderateScale(16) },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: moderateScale(12) },
  summaryCard: { flex: 1, borderRadius: moderateScale(12), padding: moderateScale(12) },
  summaryLabel: { fontSize: moderateScale(10), color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  summaryValue: { fontSize: moderateScale(18), fontWeight: '800' },
  nextPayoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFF6FF', borderRadius: moderateScale(14), padding: moderateScale(16), marginBottom: moderateScale(20), borderWidth: 1, borderColor: '#BFDBFE' },
  nextPayoutLabel: { fontSize: moderateScale(12), color: colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  nextPayoutAmount: { fontSize: moderateScale(28), fontWeight: '900', color: colors.primary },
  nextPayoutDate: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  payoutSettingsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#BFDBFE' },
  payoutSettingsText: { fontSize: moderateScale(12), color: colors.primary, fontWeight: '600' },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(10) },
  chartCard: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), marginBottom: moderateScale(20), borderWidth: 1, borderColor: colors.border },
  barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: moderateScale(110) },
  barItem: { alignItems: 'center', gap: 4 },
  barAmount: { fontSize: moderateScale(10), color: colors.textSecondary },
  barTrack: { height: moderateScale(80), justifyContent: 'flex-end' },
  bar: { width: moderateScale(32), borderRadius: 4 },
  barLabel: { fontSize: moderateScale(11), color: colors.textSecondary },
  periodTabs: { flexDirection: 'row', gap: 8, marginBottom: moderateScale(16) },
  periodTab: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  periodTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodTabText: { fontSize: moderateScale(13), color: colors.textSecondary },
  periodTabTextActive: { color: '#fff', fontWeight: '600' },
  earningRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: moderateScale(12), borderBottomWidth: 1, borderColor: colors.border },
  earningLeft: { flex: 1 },
  earningRenter: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  earningTrailer: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  earningDates: { fontSize: moderateScale(11), color: colors.textSecondary, marginTop: 2 },
  earningRight: { alignItems: 'flex-end', gap: 4 },
  earningNet: { fontSize: moderateScale(16), fontWeight: '800', color: colors.success },
  payoutBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  payoutBadgeText: { fontSize: moderateScale(11), fontWeight: '700' },
  depositTag: { fontSize: moderateScale(10), color: colors.textSecondary },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(13), marginTop: moderateScale(20) },
  downloadBtnText: { color: colors.primary, fontSize: moderateScale(14), fontWeight: '600' },
});

export default EarningsDashboardScreen;
