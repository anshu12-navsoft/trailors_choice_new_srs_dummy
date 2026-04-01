import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';

const BookingRequestDetailScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const REJECTION_REASONS = [
    t('dates_not_available'),
    t('insufficient_verification'),
    t('outside_service_area'),
    t('trailer_under_maintenance'),
    t('negative_experience'),
    t('other_reason'),
  ];
  const request = route.params?.request ?? {
    id: 'R001',
    status: 'pending',
    renterName: 'Alex Johnson',
    renterRating: 4.7,
    renterRentals: 8,
    renterVerified: true,
    trailerName: 'Heavy Duty Flatbed',
    trailerType: 'Flatbed',
    startDate: 'Mar 28, 2025',
    endDate: 'Mar 30, 2025',
    days: 2,
    totalPrice: 255,
    rentalCost: 170,
    platformFee: 20,
    deposit: 150,
    requestedAt: '2h ago',
    expiresIn: '22h',
    cardColor: '#FEF3C7',
    renterNote: 'I need this for moving furniture to a new house.',
  };

  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleApprove = () => {
    Alert.alert(
      t('approve_booking_title'),
      t('approve_booking_message', { renter: request.renterName, start: request.startDate, end: request.endDate }),
      [
        { text: t('cancel_button'), style: 'cancel' },
        {
          text: t('approve_button'),
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              Alert.alert(t('approve_success'), t('approve_success_message'));
              navigation.goBack();
            }, 1200);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    if (!selectedReason) {
      Alert.alert(t('select_reason_error'), t('select_reason_message'));
      return;
    }
    setLoading(true);
    setRejectModal(false);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Rejected', t('reject_booking_message'));
      navigation.goBack();
    }, 1000);
  };

  const isPending = request.status === 'pending';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('request_details_title')}</Text>
        <Text style={styles.refText}>{request.id}</Text>
      </View>

      {isPending && (
        <View style={styles.expiryBanner}>
          <Icon name="timer" size={moderateScale(16)} color={colors.warning} />
          <Text style={styles.expiryText}>Auto-expires in {request.expiresIn} if not acted upon</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>

        {/* Renter Profile */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('renter_profile_title')}</Text>
          <View style={styles.renterRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{request.renterName[0]}</Text>
            </View>
            <View style={styles.renterInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.renterName}>{request.renterName}</Text>
                {request.renterVerified ? (
                  <View style={styles.verifiedChip}>
                    <Icon name="verified-user" size={moderateScale(12)} color={colors.success} />
                    <Text style={styles.verifiedText}>{t('verified_chip')}</Text>
                  </View>
                ) : (
                  <View style={[styles.verifiedChip, { backgroundColor: '#FEF9C3', borderColor: '#FDE68A' }]}>
                    <Icon name="warning" size={moderateScale(12)} color={colors.warning} />
                    <Text style={[styles.verifiedText, { color: colors.warning }]}>{t('unverified_chip')}</Text>
                  </View>
                )}
              </View>
              <View style={styles.metaRow}>
                <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
                <Text style={styles.metaText}>{request.renterRating} {t('rating_label')}</Text>
                <Text style={styles.dot}>·</Text>
                <Icon name="receipt-long" size={moderateScale(13)} color={colors.textSecondary} />
                <Text style={styles.metaText}>{request.renterRentals} {t('rentals_completed')}</Text>
              </View>
            </View>
          </View>
          {request.renterNote && (
            <View style={styles.noteBox}>
              <Icon name="chat-bubble-outline" size={moderateScale(14)} color={colors.textSecondary} />
              <Text style={styles.noteText}>"{request.renterNote}"</Text>
            </View>
          )}
        </View>

        {/* Trailer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('requested_trailer_title')}</Text>
          <View style={styles.trailerRow}>
            <View style={[styles.trailerThumb, { backgroundColor: request.cardColor }]}>
              <Icon name="local-shipping" size={moderateScale(24)} color="#9CA3AF" />
            </View>
            <View>
              <Text style={styles.trailerName}>{request.trailerName}</Text>
              <Text style={styles.trailerType}>{request.trailerType}</Text>
            </View>
          </View>
        </View>

        {/* Rental Period */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('rental_period_title')}</Text>
          <View style={styles.datesRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>{t('pickup_label')}</Text>
              <Text style={styles.dateValue}>{request.startDate}</Text>
            </View>
            <Icon name="arrow-forward" size={moderateScale(18)} color={colors.textSecondary} />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>{t('return_label')}</Text>
              <Text style={styles.dateValue}>{request.endDate}</Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Icon name="access-time" size={moderateScale(13)} color={colors.textSecondary} />
            <Text style={styles.durationText}>{request.days} day{request.days !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('earnings_breakdown_title')}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('rental_earnings')}</Text>
            <Text style={styles.priceValue}>${request.rentalCost}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('platform_fee_deducted')}</Text>
            <Text style={[styles.priceValue, { color: colors.error }]}>-${request.platformFee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('deposit_held')}</Text>
            <Text style={styles.priceValue}>${request.deposit}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('you_will_receive')}</Text>
            <Text style={styles.totalValue}>${request.rentalCost - request.platformFee}</Text>
          </View>
        </View>

        <View style={{ height: moderateScale(100) }} />
      </ScrollView>

      {/* Action Buttons */}
      {isPending && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => setRejectModal(true)}
            disabled={loading}
          >
            <Icon name="close" size={moderateScale(18)} color={colors.error} />
            <Text style={styles.rejectBtnText}>{t('decline_booking_button')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.approveBtn, loading && styles.btnDisabled]}
            onPress={handleApprove}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="check" size={moderateScale(18)} color="#fff" />
                <Text style={styles.approveBtnText}>{t('approve_booking_title')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Rejection Reason Modal */}
      <Modal visible={rejectModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('reason_for_decline')}</Text>
            {REJECTION_REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonOption}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={[styles.radioBtn, selectedReason === reason && styles.radioBtnActive]}>
                  {selectedReason === reason && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.confirmRejectBtn, !selectedReason && styles.btnDisabled]}
              onPress={handleReject}
              disabled={!selectedReason}
            >
              <Text style={styles.confirmRejectBtnText}>{t('confirm_decline_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setRejectModal(false)}>
              <Text style={styles.cancelBtnText}>{t('cancel_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(12), gap: 12, borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  refText: { fontSize: moderateScale(11), color: colors.textSecondary },
  expiryBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF9C3', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(10) },
  expiryText: { flex: 1, fontSize: moderateScale(13), color: '#92400E', fontWeight: '500' },
  content: { padding: moderateScale(16), gap: 12 },
  card: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(12) },
  renterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(18), fontWeight: '700' },
  renterInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  renterName: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary },
  verifiedChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#BBF7D0' },
  verifiedText: { fontSize: moderateScale(10), color: colors.success, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: moderateScale(12), color: colors.textSecondary },
  dot: { color: colors.textSecondary },
  noteBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: colors.border },
  noteText: { flex: 1, fontSize: moderateScale(13), color: colors.textSecondary, fontStyle: 'italic' },
  trailerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trailerThumb: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(10), alignItems: 'center', justifyContent: 'center' },
  trailerName: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary },
  trailerType: { fontSize: moderateScale(12), color: colors.textSecondary, marginTop: 2 },
  datesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 10 },
  dateItem: { alignItems: 'center' },
  dateLabel: { fontSize: moderateScale(11), color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase' },
  dateValue: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'center' },
  durationText: { fontSize: moderateScale(12), color: colors.textSecondary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.border },
  priceLabel: { fontSize: moderateScale(13), color: colors.textSecondary },
  priceValue: { fontSize: moderateScale(13), color: colors.textPrimary, fontWeight: '600' },
  totalRow: { borderBottomWidth: 0, paddingTop: 10 },
  totalLabel: { fontSize: moderateScale(15), fontWeight: '800', color: colors.textPrimary },
  totalValue: { fontSize: moderateScale(18), fontWeight: '800', color: colors.success },
  actionBar: { flexDirection: 'row', gap: 10, padding: moderateScale(16), borderTopWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: colors.error, borderRadius: moderateScale(12), paddingVertical: moderateScale(13) },
  rejectBtnText: { color: colors.error, fontSize: moderateScale(14), fontWeight: '700' },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.success, borderRadius: moderateScale(12), paddingVertical: moderateScale(13) },
  approveBtnText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: moderateScale(20), paddingBottom: moderateScale(34) },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: moderateScale(17), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(14) },
  reasonOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: moderateScale(12), borderBottomWidth: 1, borderColor: colors.border },
  radioBtn: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioBtnActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  reasonText: { flex: 1, fontSize: moderateScale(14), color: colors.textPrimary },
  confirmRejectBtn: { backgroundColor: colors.error, borderRadius: moderateScale(12), paddingVertical: moderateScale(14), alignItems: 'center', marginTop: moderateScale(16) },
  confirmRejectBtnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: moderateScale(12) },
  cancelBtnText: { fontSize: moderateScale(14), color: colors.textSecondary },
});

export default BookingRequestDetailScreen;
