import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const UPCOMING_BOOKINGS = [
  { id: 'B002', trailerTitle: 'Enclosed 24ft Cargo', startDate: 'Mar 28', endDate: 'Apr 1', days: 4, totalPrice: 480, cardColor: '#D1FAE5' },
  { id: 'B003', trailerTitle: 'Car Hauler 18ft', startDate: 'Apr 5', endDate: 'Apr 6', days: 1, totalPrice: 115, cardColor: '#FCE7F3' },
];

const SAVED_TRAILERS = [
  { id: '3', title: '16ft Flatbed', pricePerDay: 60, rating: 4.9, cardColor: '#FEF3C7' },
  { id: '6', title: 'Boat Trailer 22ft', pricePerDay: 55, rating: 4.8, cardColor: '#CFFAFE' },
  { id: '8', title: '10ft Utility', pricePerDay: 35, rating: 4.7, cardColor: '#ECFDF5' },
];

const MONTHLY_SPEND = [
  { month: 'Nov', amount: 90, max: 500 },
  { month: 'Dec', amount: 265, max: 500 },
  { month: 'Jan', amount: 65, max: 500 },
  { month: 'Feb', amount: 280, max: 500 },
  { month: 'Mar', amount: 220, max: 500 },
];

const RenterDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const ACTIVITY = [
    { icon: 'check-circle', color: colors.success, text: 'Booking confirmed for Enclosed 24ft Cargo', time: '2h ago' },
    { icon: 'payment', color: colors.primary, text: 'Payment of $480 processed', time: '2h ago' },
    { icon: 'star', color: '#F59E0B', text: 'You rated 16ft Flatbed Trailer 5 stars', time: '3 days ago' },
    { icon: 'assignment-returned', color: '#6B7280', text: 'Returned Dump Trailer successfully', time: '15 days ago' },
    { icon: 'verified', color: colors.success, text: "Driver's license verified", time: '1 month ago' },
  ];

  const STATS = [
    { label: t('total_rentals_stat'), value: '8', icon: 'receipt-long', color: colors.primary },
    { label: t('total_spent_stat'), value: '$1,240', icon: 'attach-money', color: colors.success },
    { label: t('saved_trailers_stat'), value: '3', icon: 'favorite', color: '#EF4444' },
    { label: t('avg_rating_stat'), value: '4.6', icon: 'star', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('renter_dashboard_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.welcomeInfo}>
            <Text style={styles.welcomeName}>Alex Johnson</Text>
            <Text style={styles.memberSince}>{t('member_since', { month: 'Jan 2025' })}</Text>
          </View>
          <TouchableOpacity
            style={styles.verifiedBadge}
            onPress={() => navigation.navigate('DriverVerification')}
          >
            <Icon name="verified" size={moderateScale(14)} color={colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.color + '18' }]}>
                <Icon name={stat.icon} size={moderateScale(20)} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Rentals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('upcoming_rentals_section')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyRentals')}>
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        {UPCOMING_BOOKINGS.map(b => (
          <View key={b.id} style={styles.upcomingCard}>
            <View style={[styles.upcomingThumb, { backgroundColor: b.cardColor }]}>
              <Icon name="local-shipping" size={moderateScale(22)} color="#9CA3AF" />
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle} numberOfLines={1}>{b.trailerTitle}</Text>
              <Text style={styles.upcomingDates}>{b.startDate} – {b.endDate} · {b.days} days</Text>
            </View>
            <Text style={styles.upcomingPrice}>${b.totalPrice}</Text>
          </View>
        ))}

        {/* Spending Overview */}
        <Text style={styles.sectionTitle}>{t('spending_overview_section')}</Text>
        <View style={styles.spendCard}>
          <View style={styles.spendHeader}>
            <View>
              <Text style={styles.spendLabel}>{t('this_month_label')}</Text>
              <Text style={styles.spendAmount}>$220</Text>
            </View>
            <View style={styles.spendDivider} />
            <View>
              <Text style={styles.spendLabel}>{t('last_month_label')}</Text>
              <Text style={styles.spendAmount}>$280</Text>
            </View>
            <View style={styles.spendDivider} />
            <View>
              <Text style={styles.spendLabel}>{t('this_year_label')}</Text>
              <Text style={styles.spendAmount}>$920</Text>
            </View>
          </View>
          <View style={styles.barChart}>
            {MONTHLY_SPEND.map(item => (
              <View key={item.month} style={styles.barItem}>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, { height: (item.amount / item.max) * moderateScale(60), backgroundColor: item.month === 'Mar' ? colors.primary : '#BFDBFE' }]} />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Saved Trailers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('saved_trailers_section')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedList}>
          {SAVED_TRAILERS.map(tr => (
            <TouchableOpacity
              key={tr.id}
              style={styles.savedCard}
              onPress={() => navigation.navigate('RenterTrailerDetail', { trailer: tr })}
            >
              <View style={[styles.savedThumb, { backgroundColor: tr.cardColor }]}>
                <Icon name="local-shipping" size={moderateScale(24)} color="#9CA3AF" />
                <Icon name="favorite" size={moderateScale(14)} color="#EF4444" style={styles.heartIcon} />
              </View>
              <Text style={styles.savedTitle} numberOfLines={1}>{tr.title}</Text>
              <View style={styles.savedMeta}>
                <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
                <Text style={styles.savedRating}>{tr.rating}</Text>
              </View>
              <Text style={styles.savedPrice}>${tr.pricePerDay}/day</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>{t('recent_activity_section')}</Text>
        <View style={styles.activityCard}>
          {ACTIVITY.map((item, i) => (
            <View key={i} style={[styles.activityItem, i === ACTIVITY.length - 1 && styles.activityItemLast]}>
              <View style={[styles.activityIconWrap, { backgroundColor: item.color + '18' }]}>
                <Icon name={item.icon} size={moderateScale(16)} color={item.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

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
  content: { padding: moderateScale(16) },
  welcomeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', borderRadius: moderateScale(14), padding: moderateScale(14), marginBottom: moderateScale(16), borderWidth: 1, borderColor: '#BFDBFE' },
  avatar: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(20), fontWeight: '800' },
  welcomeInfo: { flex: 1 },
  welcomeName: { fontSize: moderateScale(16), fontWeight: '700', color: colors.textPrimary },
  memberSince: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  verifiedText: { fontSize: moderateScale(12), color: colors.success, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: moderateScale(20) },
  statCard: { width: '47%', backgroundColor: colors.surface, borderRadius: moderateScale(12), padding: moderateScale(14), borderWidth: 1, borderColor: colors.border },
  statIconWrap: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: moderateScale(22), fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: moderateScale(11), color: colors.textSecondary, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(10) },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(10) },
  seeAll: { fontSize: moderateScale(13), color: colors.primary, fontWeight: '500' },
  upcomingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: moderateScale(12), padding: moderateScale(12), marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  upcomingThumb: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(8), alignItems: 'center', justifyContent: 'center' },
  upcomingInfo: { flex: 1 },
  upcomingTitle: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  upcomingDates: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  upcomingPrice: { fontSize: moderateScale(15), fontWeight: '800', color: colors.primary },
  spendCard: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), marginBottom: moderateScale(20), borderWidth: 1, borderColor: colors.border },
  spendHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: moderateScale(16) },
  spendLabel: { fontSize: moderateScale(11), color: colors.textSecondary, textAlign: 'center' },
  spendAmount: { fontSize: moderateScale(18), fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginTop: 2 },
  spendDivider: { width: 1, backgroundColor: colors.border },
  barChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: moderateScale(70) },
  barItem: { alignItems: 'center', gap: 4 },
  barWrapper: { height: moderateScale(60), justifyContent: 'flex-end' },
  bar: { width: moderateScale(28), borderRadius: 4 },
  barLabel: { fontSize: moderateScale(11), color: colors.textSecondary },
  savedList: { gap: 10, paddingBottom: 4, marginBottom: moderateScale(20) },
  savedCard: { width: moderateScale(110), backgroundColor: colors.surface, borderRadius: moderateScale(12), overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  savedThumb: { height: moderateScale(70), alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heartIcon: { position: 'absolute', top: 6, right: 6 },
  savedTitle: { fontSize: moderateScale(12), fontWeight: '700', color: colors.textPrimary, padding: 8, paddingBottom: 2 },
  savedMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8 },
  savedRating: { fontSize: moderateScale(12), color: colors.textSecondary },
  savedPrice: { fontSize: moderateScale(12), fontWeight: '700', color: colors.primary, padding: 8, paddingTop: 2 },
  activityCard: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), borderWidth: 1, borderColor: colors.border },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingBottom: moderateScale(14), marginBottom: moderateScale(14), borderBottomWidth: 1, borderColor: colors.border },
  activityItemLast: { paddingBottom: 0, marginBottom: 0, borderBottomWidth: 0 },
  activityIconWrap: { width: moderateScale(34), height: moderateScale(34), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1 },
  activityText: { fontSize: moderateScale(13), color: colors.textPrimary, lineHeight: 18 },
  activityTime: { fontSize: moderateScale(11), color: colors.textSecondary, marginTop: 3 },
});

export default RenterDashboard;
