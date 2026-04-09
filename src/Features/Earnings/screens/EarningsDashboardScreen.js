import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../../Theme/ThemeContext';
import { styles } from '../stylesheets/EarningsDashboard.style';

const MONTHLY_DATA = [
  { month: 'Nov', amount: 620 },
  { month: 'Dec', amount: 890 },
  { month: 'Jan', amount: 340 },
  { month: 'Feb', amount: 1120 },
  { month: 'Mar', amount: 820 },
];

const EARNINGS_LIST = [
  {
    id: 'B001',
    renterName: 'Alex J.',
    trailerName: 'Heavy Duty Flatbed',
    dates: 'Mar 22–24',
    gross: 170,
    fee: 20,
    net: 150,
    status: 'paid',
    depositReleased: true,
  },
  {
    id: 'B002',
    renterName: 'Maria L.',
    trailerName: 'Enclosed Cargo 7x14',
    dates: 'Mar 28–Apr 1',
    gross: 440,
    fee: 44,
    net: 396,
    status: 'pending',
    depositReleased: false,
  },
  {
    id: 'B003',
    renterName: 'Chris P.',
    trailerName: 'Dump Trailer 14ft',
    dates: 'Apr 5–7',
    gross: 300,
    fee: 30,
    net: 270,
    status: 'pending',
    depositReleased: false,
  },
  {
    id: 'B004',
    renterName: 'Sandra K.',
    trailerName: 'Heavy Duty Flatbed',
    dates: 'Mar 10–12',
    gross: 170,
    fee: 20,
    net: 150,
    status: 'paid',
    depositReleased: true,
  },
  {
    id: 'B005',
    renterName: 'Tom W.',
    trailerName: 'Enclosed Cargo 7x14',
    dates: 'Mar 5–6',
    gross: 110,
    fee: 11,
    net: 99,
    status: 'paid',
    depositReleased: true,
  },
  {
    id: 'B006',
    renterName: 'Jennifer B.',
    trailerName: 'Dump Trailer 14ft',
    dates: 'Feb 20–23',
    gross: 450,
    fee: 45,
    net: 405,
    status: 'paid',
    depositReleased: true,
  },
];

const EarningsRow = ({ item }) => {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View style={styles.earningRow}>
      <View style={styles.earningLeft}>
        <Text style={styles.earningRenter}>{item.renterName}</Text>
        <Text style={styles.earningTrailer} numberOfLines={1}>
          {item.trailerName}
        </Text>
        <Text style={styles.earningDates}>{item.dates}</Text>
      </View>
      <View style={styles.earningRight}>
        <Text style={styles.earningNet}>${item.net}</Text>
        <View
          style={[
            styles.payoutBadge,
            { backgroundColor: item.status === 'paid' ? '#DCFCE7' : '#FEF9C3' },
          ]}
        >
          <Text
            style={[
              styles.payoutBadgeText,
              { color: item.status === 'paid' ? colors.success : '#92400E' },
            ]}
          >
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
  const PERIOD_TABS = [
    t('this_month_label'),
    t('last_month_label'),
    'All Time',
  ];
  const [activePeriod, setActivePeriod] = useState(PERIOD_TABS[0]);

  const maxBar = Math.max(...MONTHLY_DATA.map(d => d.amount));

  const totalEarned = EARNINGS_LIST.reduce((s, e) => s + e.net, 0);
  const pendingAmount = EARNINGS_LIST.filter(
    e => e.status === 'pending',
  ).reduce((s, e) => s + e.net, 0);
  const paidAmount = EARNINGS_LIST.filter(e => e.status === 'paid').reduce(
    (s, e) => s + e.net,
    0,
  );

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
        <Text style={styles.headerTitle}>{t('earnings_dashboard_title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PayoutSettings')}>
          <Icon
            name="settings"
            size={moderateScale(22)}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.summaryLabel}>{t('total_earned_label')}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              ${totalEarned.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.summaryLabel}>{t('paid_out_label')}</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              ${paidAmount.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF9C3' }]}>
            <Text style={styles.summaryLabel}>{t('pending_label')}</Text>
            <Text style={[styles.summaryValue, { color: '#92400E' }]}>
              ${pendingAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Next Payout Card */}
        <View style={styles.nextPayoutCard}>
          <View>
            <Text style={styles.nextPayoutLabel}>{t('next_payout_label')}</Text>
            <Text style={styles.nextPayoutAmount}>${pendingAmount}</Text>
            <Text style={styles.nextPayoutDate}>
              {t('expected_payout', {
                date: 'Apr 1, 2025',
                schedule: t('weekly_schedule'),
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.payoutSettingsBtn}
            onPress={() => navigation.navigate('PayoutSettings')}
          >
            <Icon
              name="account-balance"
              size={moderateScale(16)}
              color={colors.primary}
            />
            <Text style={styles.payoutSettingsText}>
              {t('payout_settings_label')}
            </Text>
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
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.amount / maxBar) * moderateScale(80),
                        backgroundColor:
                          item.month === 'Mar' ? colors.primary : '#BFDBFE',
                      },
                    ]}
                  />
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
              style={[
                styles.periodTab,
                activePeriod === tab && styles.periodTabActive,
              ]}
              onPress={() => setActivePeriod(tab)}
            >
              <Text
                style={[
                  styles.periodTabText,
                  activePeriod === tab && styles.periodTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings List */}
        <Text style={styles.sectionTitle}>{t('booking_earnings_section')}</Text>
        {EARNINGS_LIST.map(item => (
          <EarningsRow key={item.id} item={item} />
        ))}

        {/* Download Statement */}
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() =>
            Alert.alert('Download', t('download_statement_message'))
          }
        >
          <Icon
            name="download"
            size={moderateScale(18)}
            color={colors.primary}
          />
          <Text style={styles.downloadBtnText}>
            {t('download_statement_button')}
          </Text>
        </TouchableOpacity>

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EarningsDashboardScreen;
