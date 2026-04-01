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

const ACTIVE_LISTINGS = [
  { id: '1', name: 'Heavy Duty Flatbed', type: 'Flatbed', pricePerDay: 85, booked: true, cardColor: '#FEF3C7' },
  { id: '2', name: 'Enclosed Cargo 7x14', type: 'Enclosed', pricePerDay: 110, booked: false, cardColor: '#D1FAE5' },
  { id: '3', name: 'Dump Trailer 14ft', type: 'Dump', pricePerDay: 150, booked: false, cardColor: '#EDE9FE' },
];

const UPCOMING_BOOKINGS = [
  { id: 'R001', renterName: 'Alex J.', trailerName: 'Heavy Duty Flatbed', startDate: 'Mar 28', endDate: 'Mar 30', totalPrice: 255, cardColor: '#FEF3C7' },
  { id: 'R002', renterName: 'Chris P.', trailerName: 'Enclosed Cargo 7x14', startDate: 'Apr 2', endDate: 'Apr 5', totalPrice: 440, cardColor: '#D1FAE5' },
  { id: 'R003', renterName: 'Maria L.', trailerName: 'Dump Trailer 14ft', startDate: 'Apr 8', endDate: 'Apr 9', totalPrice: 300, cardColor: '#EDE9FE' },
];

const OwnerDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const STATS = [
    { label: t('active_listings_section'), value: '4', icon: 'local-shipping', color: colors.primary },
    { label: t('bookings_label'), value: '31', icon: 'receipt-long', color: colors.success },
    { label: t('monthly_revenue_section'), value: '$1,820', icon: 'attach-money', color: '#F59E0B' },
    { label: t('avg_rating_stat'), value: '4.8', icon: 'star', color: '#EF4444' },
  ];

  const ALERTS = [
    { icon: 'pending-actions', color: colors.warning, text: '2 booking requests awaiting approval', action: 'BookingRequests' },
    { icon: 'rate-review', color: colors.primary, text: '1 new review from Alex J.', action: 'OwnerReviews' },
  ];

  const QUICK_ACTIONS = [
    { icon: 'add-circle', label: t('add_listing_action'), route: 'AddTrailor', color: colors.primary },
    { icon: 'pending-actions', label: t('requests_action'), route: 'BookingRequests', color: colors.warning },
    { icon: 'event', label: t('calendar_action'), route: 'AvailabilityCalendar', color: colors.success },
    { icon: 'account-balance-wallet', label: t('earnings_action'), route: 'EarningsDashboard', color: '#8B5CF6' },
  ];

  return (
  <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />

    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('owner_dashboard_title')}</Text>
    </View>

    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Welcome */}
      <View style={styles.welcomeCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeName}>John D. {t('owner_label')}</Text>
          <Text style={styles.memberSince}>{t('member_since', { month: 'Jan 2024' })}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Icon name="verified" size={moderateScale(14)} color={colors.success} />
          <Text style={styles.verifiedText}>{t('verified_chip')}</Text>
        </View>
      </View>

      {/* Alerts */}
      {ALERTS.map((alert, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.alertCard, { borderLeftColor: alert.color }]}
          onPress={() => navigation.navigate(alert.action)}
        >
          <Icon name={alert.icon} size={moderateScale(18)} color={alert.color} />
          <Text style={styles.alertText}>{alert.text}</Text>
          <Icon name="chevron-right" size={moderateScale(18)} color={colors.textSecondary} />
        </TouchableOpacity>
      ))}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {STATS.map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
              <Icon name={stat.icon} size={moderateScale(20)} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>{t('quick_actions_section')}</Text>
      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.label}
            style={styles.quickAction}
            onPress={() => navigation.navigate(action.route)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
              <Icon name={action.icon} size={moderateScale(22)} color={action.color} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Listings */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('active_listings_section')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyTrailors')}>
          <Text style={styles.seeAll}>{t('view_all')}</Text>
        </TouchableOpacity>
      </View>
      {ACTIVE_LISTINGS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.listingCard}
          onPress={() => navigation.navigate('TrailerDetail', { trailer: item })}
        >
          <View style={[styles.listingThumb, { backgroundColor: item.cardColor }]}>
            <Icon name="local-shipping" size={moderateScale(22)} color="#9CA3AF" />
          </View>
          <View style={styles.listingInfo}>
            <Text style={styles.listingName}>{item.name}</Text>
            <Text style={styles.listingType}>{item.type}</Text>
          </View>
          <View style={styles.listingRight}>
            <View style={[styles.statusBadge, { backgroundColor: item.booked ? '#DBEAFE' : '#F0FDF4' }]}>
              <Text style={[styles.statusText, { color: item.booked ? colors.primary : colors.success }]}>
                {item.booked ? t('booked_status') : t('available_status')}
              </Text>
            </View>
            <Text style={styles.listingPrice}>${item.pricePerDay}/day</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Upcoming Bookings */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('upcoming_bookings_section')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OwnerBookings')}>
          <Text style={styles.seeAll}>{t('view_all')}</Text>
        </TouchableOpacity>
      </View>
      {UPCOMING_BOOKINGS.map(b => (
        <View key={b.id} style={styles.bookingCard}>
          <View style={[styles.bookingThumb, { backgroundColor: b.cardColor }]}>
            <Icon name="local-shipping" size={moderateScale(20)} color="#9CA3AF" />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingRenter}>{b.renterName}</Text>
            <Text style={styles.bookingTrailer} numberOfLines={1}>{b.trailerName}</Text>
            <Text style={styles.bookingDates}>{b.startDate} – {b.endDate}</Text>
          </View>
          <Text style={styles.bookingPrice}>${b.totalPrice}</Text>
        </View>
      ))}

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
  welcomeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', borderRadius: moderateScale(14), padding: moderateScale(14), marginBottom: moderateScale(12), borderWidth: 1, borderColor: '#BFDBFE' },
  avatar: { width: moderateScale(46), height: moderateScale(46), borderRadius: moderateScale(23), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(18), fontWeight: '800' },
  welcomeInfo: { flex: 1 },
  welcomeName: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary },
  memberSince: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  verifiedText: { fontSize: moderateScale(12), color: colors.success, fontWeight: '600' },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: moderateScale(10), padding: moderateScale(12), marginBottom: 8, borderLeftWidth: 4, borderWidth: 1, borderColor: colors.border },
  alertText: { flex: 1, fontSize: moderateScale(13), color: colors.textPrimary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: moderateScale(16) },
  statCard: { width: '47%', backgroundColor: colors.surface, borderRadius: moderateScale(12), padding: moderateScale(14), borderWidth: 1, borderColor: colors.border },
  statIcon: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: moderateScale(20), fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: moderateScale(11), color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(10) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(10) },
  seeAll: { fontSize: moderateScale(13), color: colors.primary, fontWeight: '500' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: moderateScale(20) },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionIcon: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(14), alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { fontSize: moderateScale(11), color: colors.textSecondary, fontWeight: '500' },
  listingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: moderateScale(12), padding: moderateScale(12), marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  listingThumb: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center' },
  listingInfo: { flex: 1 },
  listingName: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  listingType: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  listingRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  statusText: { fontSize: moderateScale(11), fontWeight: '600' },
  listingPrice: { fontSize: moderateScale(13), fontWeight: '700', color: colors.textPrimary },
  bookingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: moderateScale(12), padding: moderateScale(12), marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  bookingThumb: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center' },
  bookingInfo: { flex: 1 },
  bookingRenter: { fontSize: moderateScale(13), fontWeight: '700', color: colors.textPrimary },
  bookingTrailer: { fontSize: moderateScale(12), color: colors.textSecondary },
  bookingDates: { fontSize: moderateScale(11), color: colors.primary, marginTop: 2 },
  bookingPrice: { fontSize: moderateScale(15), fontWeight: '800', color: colors.primary },
});

export default OwnerDashboard;
