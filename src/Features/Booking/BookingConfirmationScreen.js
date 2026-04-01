import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, Alert, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Constants/Colors';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const booking = route.params?.booking ?? {};

  const handleShare = async () => {
    try {
      await Share.share({ message: `My trailer booking is confirmed! Ref: ${booking.id}. Pickup: ${formatDate(booking.startDate)}` });
    } catch {
      Alert.alert('Share', 'Sharing is not available.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Success Animation */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Icon name="check-circle" size={moderateScale(72)} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>{t('booking_confirmed_title')}</Text>
          <Text style={styles.successSubtitle}>{t('booking_confirmed_message')}</Text>
        </View>

        {/* Booking Reference */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>{t('booking_reference_label')}</Text>
          <Text style={styles.refNumber}>{booking.id ?? 'TRL-2025-001234'}</Text>
        </View>

        {/* Booking Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('booking_summary_title')}</Text>
          <View style={styles.summaryRow}>
            <Icon name="local-shipping" size={moderateScale(16)} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>{t('trailer_label')}</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>{booking.trailer?.title ?? '20ft Utility Trailer'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon name="category" size={moderateScale(16)} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>{t('category_label')}</Text>
            <Text style={styles.summaryValue}>{booking.trailer?.category ?? 'Utility'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon name="today" size={moderateScale(16)} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>{t('pickup_label')}</Text>
            <Text style={styles.summaryValue}>{formatDate(booking.startDate)} · {booking.pickupTime ?? '10:00 AM'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon name="event" size={moderateScale(16)} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>{t('return_label')}</Text>
            <Text style={styles.summaryValue}>{formatDate(booking.endDate)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Icon name="attach-money" size={moderateScale(16)} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>{t('total_paid_label')}</Text>
            <Text style={[styles.summaryValue, styles.totalPaid]}>${booking.total ?? 300}</Text>
          </View>
        </View>

        {/* Pickup Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('pickup_instructions_title')}</Text>
          <View style={styles.addressRow}>
            <Icon name="place" size={moderateScale(18)} color={colors.primary} />
            <Text style={styles.addressText}>{booking.address ?? '123 Oak Lane, Austin, TX 78701'}</Text>
          </View>
          <View style={styles.instructionNote}>
            <Icon name="info-outline" size={moderateScale(14)} color={colors.textSecondary} />
            <Text style={styles.instructionText}>
              {t('pickup_time_within_15_minutes')}
            </Text>
          </View>
          <TouchableOpacity style={styles.directionsBtn}>
            <Icon name="directions" size={moderateScale(16)} color={colors.primary} />
            <Text style={styles.directionsBtnText}>{t('get_directions_button')}</Text>
          </TouchableOpacity>
        </View>

        {/* Owner Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('owner_contact_title')}</Text>
          <View style={styles.ownerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(booking.ownerName ?? 'J')[0]}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{booking.ownerName ?? 'John D.'}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
                <Text style={styles.ownerRating}>{booking.ownerRating ?? 4.9} · {t('verified_owner')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.msgBtn}
              onPress={() => navigation.navigate('Messages')}
            >
              <Icon name="chat-bubble-outline" size={moderateScale(16)} color="#fff" />
              <Text style={styles.msgBtnText}>{t('message_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('MyRentals')}
        >
          <Icon name="list-alt" size={moderateScale(18)} color="#fff" />
          <Text style={styles.primaryBtnText}>{t('view_my_rentals_button')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleShare}>
          <Icon name="share" size={moderateScale(18)} color={colors.primary} />
          <Text style={styles.outlineBtnText}>{t('share_booking_button')}</Text>
        </TouchableOpacity>

        <Text style={styles.emailNote}>
          {t('email_confirmation_note')}
        </Text>

        <View style={{ height: moderateScale(20) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { padding: moderateScale(20) },
  successSection: { alignItems: 'center', paddingVertical: moderateScale(24) },
  successCircle: { marginBottom: moderateScale(16) },
  successTitle: { fontSize: moderateScale(26), fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  successSubtitle: { fontSize: moderateScale(14), color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  refCard: { backgroundColor: '#EFF6FF', borderRadius: moderateScale(14), padding: moderateScale(16), alignItems: 'center', marginBottom: moderateScale(16), borderWidth: 1, borderColor: '#BFDBFE' },
  refLabel: { fontSize: moderateScale(12), color: colors.textSecondary, marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  refNumber: { fontSize: moderateScale(22), fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  card: { backgroundColor: colors.surface, borderRadius: moderateScale(14), padding: moderateScale(16), marginBottom: moderateScale(12), borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: moderateScale(15), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(12) },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.border },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryLabel: { fontSize: moderateScale(13), color: colors.textSecondary, width: moderateScale(60) },
  summaryValue: { flex: 1, fontSize: moderateScale(13), color: colors.textPrimary, fontWeight: '500', textAlign: 'right' },
  totalPaid: { fontWeight: '800', color: colors.primary, fontSize: moderateScale(15) },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  addressText: { flex: 1, fontSize: moderateScale(14), color: colors.textPrimary, fontWeight: '500' },
  instructionNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#FEF9C3', borderRadius: 8, padding: 10, marginBottom: 12 },
  instructionText: { flex: 1, fontSize: moderateScale(12), color: colors.textSecondary },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, padding: 10, justifyContent: 'center' },
  directionsBtnText: { fontSize: moderateScale(14), color: colors.primary, fontWeight: '600' },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: moderateScale(42), height: moderateScale(42), borderRadius: moderateScale(21), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: moderateScale(17), fontWeight: '700' },
  ownerInfo: { flex: 1 },
  ownerName: { fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  ownerRating: { fontSize: moderateScale(12), color: colors.textSecondary },
  msgBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  msgBtnText: { color: '#fff', fontSize: moderateScale(12), fontWeight: '600' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(14), marginBottom: moderateScale(10) },
  primaryBtnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '700' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(13), marginBottom: moderateScale(16) },
  outlineBtnText: { color: colors.primary, fontSize: moderateScale(15), fontWeight: '600' },
  emailNote: { textAlign: 'center', fontSize: moderateScale(12), color: colors.textSecondary },
});

export default BookingConfirmationScreen;
