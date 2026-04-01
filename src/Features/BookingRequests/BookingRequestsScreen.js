import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const MOCK_REQUESTS = [
  { id: 'R001', status: 'pending', renterName: 'Alex Johnson', renterRating: 4.7, renterRentals: 8, renterVerified: true, trailerName: 'Heavy Duty Flatbed', trailerType: 'Flatbed', startDate: 'Mar 28, 2025', endDate: 'Mar 30, 2025', days: 2, totalPrice: 255, requestedAt: '2h ago', expiresIn: '22h', cardColor: '#FEF3C7' },
  { id: 'R002', status: 'pending', renterName: 'Maria Lopez', renterRating: 4.9, renterRentals: 15, renterVerified: true, trailerName: 'Enclosed Cargo 7x14', trailerType: 'Enclosed', startDate: 'Apr 2, 2025', endDate: 'Apr 5, 2025', days: 3, totalPrice: 330, requestedAt: '5h ago', expiresIn: '19h', cardColor: '#D1FAE5' },
  { id: 'R003', status: 'approved', renterName: 'Chris Park', renterRating: 4.5, renterRentals: 3, renterVerified: true, trailerName: 'Dump Trailer 14ft', trailerType: 'Dump', startDate: 'Mar 22, 2025', endDate: 'Mar 24, 2025', days: 2, totalPrice: 300, requestedAt: '1 day ago', expiresIn: null, cardColor: '#EDE9FE' },
  { id: 'R004', status: 'approved', renterName: 'Sandra Kim', renterRating: 4.8, renterRentals: 12, renterVerified: true, trailerName: 'Heavy Duty Flatbed', trailerType: 'Flatbed', startDate: 'Mar 15, 2025', endDate: 'Mar 17, 2025', days: 2, totalPrice: 255, requestedAt: '3 days ago', expiresIn: null, cardColor: '#FEF3C7' },
  { id: 'R005', status: 'rejected', renterName: 'Tom Wilson', renterRating: 3.2, renterRentals: 2, renterVerified: false, trailerName: 'Enclosed Cargo 7x14', trailerType: 'Enclosed', startDate: 'Mar 10, 2025', endDate: 'Mar 12, 2025', days: 2, totalPrice: 220, requestedAt: '5 days ago', expiresIn: null, cardColor: '#D1FAE5', rejectionReason: 'Insufficient verification' },
];

const RequestCard = ({ item, onPress }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const STATUS_CONFIG = {
    pending: { color: colors.warning, bg: '#FEF9C3', icon: 'schedule', label: 'PENDING' },
    approved: { color: colors.success, bg: '#DCFCE7', icon: 'check-circle', label: 'APPROVED' },
    rejected: { color: colors.error, bg: '#FEE2E2', icon: 'cancel', label: 'REJECTED' },
  };
  const cfg = STATUS_CONFIG[item.status];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        {/* Renter Info */}
        <View style={styles.renterRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.renterName[0]}</Text>
          </View>
          <View style={styles.renterInfo}>
            <View style={styles.renterNameRow}>
              <Text style={styles.renterName}>{item.renterName}</Text>
              {item.renterVerified && (
                <Icon name="verified-user" size={moderateScale(14)} color={colors.success} />
              )}
            </View>
            <View style={styles.renterMeta}>
              <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
              <Text style={styles.renterMetaText}>{item.renterRating}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.renterMetaText}>{item.renterRentals} {t('rating_label')}</Text>
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

        {/* Dates & Price */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="date-range" size={moderateScale(14)} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.startDate} – {item.endDate} ({item.days}d)</Text>
          </View>
          <Text style={styles.totalPrice}>${item.totalPrice}</Text>
        </View>

        {/* Expiry / Rejection */}
        {item.status === 'pending' && (
          <View style={styles.expiryBanner}>
            <Icon name="timer" size={moderateScale(13)} color={colors.warning} />
            <Text style={styles.expiryText}>{t('expires_in', { time: item.expiresIn })} · {t('requested_at', { time: item.requestedAt })}</Text>
          </View>
        )}
        {item.status === 'rejected' && item.rejectionReason && (
          <View style={styles.rejectionNote}>
            <Icon name="info-outline" size={moderateScale(13)} color={colors.error} />
            <Text style={styles.rejectionText}>{t('rejection_reason_prefix')}{item.rejectionReason}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetail}>{t('view_details_button')}</Text>
        <Icon name="chevron-right" size={moderateScale(18)} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const BookingRequestsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const TABS = [t('pending_requests'), t('approved_requests'), t('rejected_requests')];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const tabFilter = { [TABS[0]]: 'pending', [TABS[1]]: 'approved', [TABS[2]]: 'rejected' };
  const filtered = MOCK_REQUESTS.filter(r => r.status === tabFilter[activeTab]);
  const pendingCount = MOCK_REQUESTS.filter(r => r.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('booking_requests_title')}</Text>
        {pendingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {tab === TABS[0] && pendingCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RequestCard
            item={item}
            onPress={() => navigation.navigate('BookingRequestDetail', { request: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="inbox" size={moderateScale(48)} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {activeTab === TABS[0] ? t('no_pending_requests') : activeTab === TABS[1] ? t('no_approved_requests') : t('no_rejected_requests')}
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
  badge: { backgroundColor: colors.error, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: moderateScale(11), fontWeight: '700' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, paddingHorizontal: moderateScale(16) },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: moderateScale(10), borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: moderateScale(14), color: colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  tabBadge: { backgroundColor: colors.warning, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  tabBadgeText: { color: '#fff', fontSize: moderateScale(10), fontWeight: '700' },
  list: { padding: moderateScale(16), gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: moderateScale(14), borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardTop: { padding: moderateScale(14), gap: 10 },
  renterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(16), fontWeight: '700' },
  renterInfo: { flex: 1 },
  renterNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  renterName: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  renterMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  renterMetaText: { fontSize: moderateScale(12), color: colors.textSecondary },
  dot: { color: colors.textSecondary },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: moderateScale(10), fontWeight: '700' },
  trailerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: moderateScale(8), padding: moderateScale(8) },
  trailerThumb: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(8), alignItems: 'center', justifyContent: 'center' },
  trailerName: { fontSize: moderateScale(13), fontWeight: '600', color: colors.textPrimary },
  trailerType: { fontSize: moderateScale(11), color: colors.textSecondary },
  detailsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: moderateScale(13), color: colors.textSecondary },
  totalPrice: { fontSize: moderateScale(16), fontWeight: '800', color: colors.primary },
  expiryBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF9C3', borderRadius: 8, padding: 8 },
  expiryText: { flex: 1, fontSize: moderateScale(12), color: '#92400E' },
  rejectionNote: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEE2E2', borderRadius: 8, padding: 8 },
  rejectionText: { flex: 1, fontSize: moderateScale(12), color: colors.error },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: moderateScale(10), borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  viewDetail: { fontSize: moderateScale(13), color: colors.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: moderateScale(60), gap: 8 },
  emptyTitle: { fontSize: moderateScale(16), fontWeight: '600', color: colors.textSecondary },
});

export default BookingRequestsScreen;
