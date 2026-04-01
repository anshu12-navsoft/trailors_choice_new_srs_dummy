import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, FlatList,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const MOCK_BOOKINGS = [
  { id: 'B001', status: 'active', renterName: 'Alex Johnson', renterRating: 4.7, renterVerified: true, trailerName: 'Heavy Duty Flatbed', trailerType: 'Flatbed', startDate: 'Mar 22, 2025', endDate: 'Mar 24, 2025', days: 2, totalEarning: 150, pickupTime: '9:00 AM', returnTime: '5:00 PM', cardColor: '#FEF3C7' },
  { id: 'B002', status: 'upcoming', renterName: 'Maria Lopez', renterRating: 4.9, renterVerified: true, trailerName: 'Enclosed Cargo 7x14', trailerType: 'Enclosed', startDate: 'Mar 28, 2025', endDate: 'Apr 1, 2025', days: 4, totalEarning: 396, pickupTime: '10:00 AM', returnTime: '6:00 PM', cardColor: '#D1FAE5' },
  { id: 'B003', status: 'upcoming', renterName: 'Chris Park', renterRating: 4.5, renterVerified: true, trailerName: 'Dump Trailer 14ft', trailerType: 'Dump', startDate: 'Apr 5, 2025', endDate: 'Apr 7, 2025', days: 2, totalEarning: 270, pickupTime: '8:00 AM', returnTime: '4:00 PM', cardColor: '#EDE9FE' },
  { id: 'B004', status: 'completed', renterName: 'Sandra Kim', renterRating: 4.8, renterVerified: true, trailerName: 'Heavy Duty Flatbed', trailerType: 'Flatbed', startDate: 'Mar 10, 2025', endDate: 'Mar 12, 2025', days: 2, totalEarning: 150, pickupTime: '9:00 AM', returnTime: '5:00 PM', cardColor: '#FEF3C7' },
  { id: 'B005', status: 'completed', renterName: 'Tom Wilson', renterRating: 4.2, renterVerified: true, trailerName: 'Enclosed Cargo 7x14', trailerType: 'Enclosed', startDate: 'Mar 5, 2025', endDate: 'Mar 6, 2025', days: 1, totalEarning: 99, pickupTime: '10:00 AM', returnTime: '4:00 PM', cardColor: '#D1FAE5' },
  { id: 'B006', status: 'completed', renterName: 'Jennifer B.', renterRating: 4.9, renterVerified: true, trailerName: 'Dump Trailer 14ft', trailerType: 'Dump', startDate: 'Feb 20, 2025', endDate: 'Feb 23, 2025', days: 3, totalEarning: 405, pickupTime: '8:00 AM', returnTime: '6:00 PM', cardColor: '#EDE9FE' },
];

const BookingCard = ({ item, onConfirmReturn, onMessage }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const STATUS_CONFIG = {
    upcoming: { color: colors.primary, bg: '#EFF6FF', label: 'UPCOMING' },
    active: { color: colors.success, bg: '#DCFCE7', label: 'ACTIVE' },
    completed: { color: '#6B7280', bg: '#F3F4F6', label: 'COMPLETED' },
  };
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.upcoming;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {/* Renter info */}
        <View style={styles.renterRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.renterName[0]}</Text>
          </View>
          <View style={styles.renterInfo}>
            <View style={styles.renterNameRow}>
              <Text style={styles.renterName}>{item.renterName}</Text>
              {item.renterVerified && (
                <Icon name="verified-user" size={moderateScale(13)} color={colors.success} />
              )}
            </View>
            <View style={styles.metaRow}>
              <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
              <Text style={styles.metaText}>{item.renterRating}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Trailer */}
        <View style={styles.trailerRow}>
          <View style={[styles.trailerThumb, { backgroundColor: item.cardColor }]}>
            <Icon name="local-shipping" size={moderateScale(18)} color="#9CA3AF" />
          </View>
          <View>
            <Text style={styles.trailerName}>{item.trailerName}</Text>
            <Text style={styles.trailerType}>{item.trailerType}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="date-range" size={moderateScale(13)} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.startDate} – {item.endDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={moderateScale(13)} color={colors.textSecondary} />
            <Text style={styles.detailText}>Pickup {item.pickupTime} · Return {item.returnTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="attach-money" size={moderateScale(13)} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.success, fontWeight: '700' }]}>You earn: ${item.totalEarning}</Text>
          </View>
        </View>

        {item.status === 'active' && (
          <View style={styles.returnBanner}>
            <Icon name="access-time" size={moderateScale(14)} color={colors.warning} />
            <Text style={styles.returnBannerText}>{t('return_by_date', { date: item.endDate, time: item.returnTime })}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        {item.status === 'active' && (
          <TouchableOpacity style={styles.returnBtn} onPress={() => onConfirmReturn(item)}>
            <Icon name="check-circle-outline" size={moderateScale(16)} color={colors.success} />
            <Text style={styles.returnBtnText}>{t('confirm_return_button')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.msgBtn} onPress={() => onMessage()}>
          <Icon name="chat-bubble-outline" size={moderateScale(16)} color={colors.primary} />
          <Text style={styles.msgBtnText}>{t('message_renter_button')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OwnerBookingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const TABS = [t('upcoming_rentals'), t('active_rentals'), t('past_rentals')];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const tabFilter = { [TABS[0]]: 'upcoming', [TABS[1]]: 'active', [TABS[2]]: 'completed' };
  const filtered = MOCK_BOOKINGS.filter(b => b.status === tabFilter[activeTab]);

  const stats = {
    upcoming: MOCK_BOOKINGS.filter(b => b.status === 'upcoming').length,
    active: MOCK_BOOKINGS.filter(b => b.status === 'active').length,
    completed: MOCK_BOOKINGS.filter(b => b.status === 'completed').length,
  };

  const handleConfirmReturn = (booking) => {
    Alert.alert(
      t('confirm_return_title'),
      t('confirm_return_message', { renter: booking.renterName, trailer: booking.trailerName }),
      [
        { text: t('cancel_button'), style: 'cancel' },
        {
          text: t('confirm_return_button'),
          onPress: () => Alert.alert(t('return_confirmed_title'), t('return_confirmed_message')),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('my_bookings_owner_title')}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { borderColor: colors.primary }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>{TABS[0]}</Text>
        </View>
        <View style={[styles.statChip, { borderColor: colors.success }]}>
          <Text style={[styles.statNum, { color: colors.success }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>{TABS[1]}</Text>
        </View>
        <View style={[styles.statChip, { borderColor: '#6B7280' }]}>
          <Text style={[styles.statNum, { color: '#6B7280' }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>{TABS[2]}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onConfirmReturn={handleConfirmReturn}
            onMessage={() => navigation.navigate('Messages')}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="inbox" size={moderateScale(48)} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {activeTab === TABS[0] ? t('no_upcoming_bookings') : activeTab === TABS[1] ? t('no_active_bookings') : t('no_completed_bookings')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: 12, borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12) },
  statChip: { flex: 1, alignItems: 'center', paddingVertical: moderateScale(10), borderRadius: moderateScale(10), borderWidth: 1.5 },
  statNum: { fontSize: moderateScale(20), fontWeight: '800' },
  statLabel: { fontSize: moderateScale(11), color: colors.textSecondary, marginTop: 2 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, marginHorizontal: moderateScale(16) },
  tab: { flex: 1, paddingVertical: moderateScale(10), alignItems: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: moderateScale(14), color: colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  list: { padding: moderateScale(16), gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: moderateScale(14), borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardTop: { padding: moderateScale(14), gap: 10 },
  renterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(16), fontWeight: '700' },
  renterInfo: { flex: 1 },
  renterNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  renterName: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  metaText: { fontSize: moderateScale(12), color: colors.textSecondary },
  statusBadge: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  statusText: { fontSize: moderateScale(10), fontWeight: '700' },
  trailerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: moderateScale(8), padding: moderateScale(8) },
  trailerThumb: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(8), alignItems: 'center', justifyContent: 'center' },
  trailerName: { fontSize: moderateScale(13), fontWeight: '600', color: colors.textPrimary },
  trailerType: { fontSize: moderateScale(11), color: colors.textSecondary },
  detailsGrid: { gap: 5 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: moderateScale(12), color: colors.textSecondary },
  returnBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF9C3', borderRadius: 8, padding: 8 },
  returnBannerText: { flex: 1, fontSize: moderateScale(12), color: '#92400E', fontWeight: '500' },
  cardActions: { flexDirection: 'row', gap: 8, padding: moderateScale(12), borderTopWidth: 1, borderColor: colors.border },
  returnBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#F0FDF4', borderRadius: moderateScale(8), paddingVertical: moderateScale(9), borderWidth: 1, borderColor: '#BBF7D0' },
  returnBtnText: { color: colors.success, fontSize: moderateScale(13), fontWeight: '700' },
  msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: colors.primary, borderRadius: moderateScale(8), paddingVertical: moderateScale(9) },
  msgBtnText: { color: colors.primary, fontSize: moderateScale(13), fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: moderateScale(60), gap: 8 },
  emptyTitle: { fontSize: moderateScale(16), fontWeight: '600', color: colors.textSecondary },
});

export default OwnerBookingsScreen;
