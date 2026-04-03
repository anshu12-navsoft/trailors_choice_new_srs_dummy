import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';
import { styles } from './BookingRequestDetail.style';

const BookingRequestDetailScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const colors = useColors();

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
      t('approve_booking_message', {
        renter: request.renterName,
        start: request.startDate,
        end: request.endDate,
      }),
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
      ],
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
        <Text style={styles.headerTitle}>{t('request_details_title')}</Text>
        <Text style={styles.refText}>{request.id}</Text>
      </View>

      {isPending && (
        <View style={styles.expiryBanner}>
          <Icon name="timer" size={moderateScale(16)} color={colors.warning} />
          <Text style={styles.expiryText}>
            Auto-expires in {request.expiresIn} if not acted upon
          </Text>
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
                    <Icon
                      name="verified-user"
                      size={moderateScale(12)}
                      color={colors.success}
                    />
                    <Text style={styles.verifiedText}>
                      {t('verified_chip')}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.verifiedChip,
                      { backgroundColor: '#FEF9C3', borderColor: '#FDE68A' },
                    ]}
                  >
                    <Icon
                      name="warning"
                      size={moderateScale(12)}
                      color={colors.warning}
                    />
                    <Text
                      style={[styles.verifiedText, { color: colors.warning }]}
                    >
                      {t('unverified_chip')}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.metaRow}>
                <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
                <Text style={styles.metaText}>
                  {request.renterRating} {t('rating_label')}
                </Text>
                <Text style={styles.dot}>·</Text>
                <Icon
                  name="receipt-long"
                  size={moderateScale(13)}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaText}>
                  {request.renterRentals} {t('rentals_completed')}
                </Text>
              </View>
            </View>
          </View>
          {request.renterNote && (
            <View style={styles.noteBox}>
              <Icon
                name="chat-bubble-outline"
                size={moderateScale(14)}
                color={colors.textSecondary}
              />
              <Text style={styles.noteText}>"{request.renterNote}"</Text>
            </View>
          )}
        </View>

        {/* Trailer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('requested_trailer_title')}</Text>
          <View style={styles.trailerRow}>
            <View
              style={[
                styles.trailerThumb,
                { backgroundColor: request.cardColor },
              ]}
            >
              <Icon
                name="local-shipping"
                size={moderateScale(24)}
                color="#9CA3AF"
              />
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
            <Icon
              name="arrow-forward"
              size={moderateScale(18)}
              color={colors.textSecondary}
            />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>{t('return_label')}</Text>
              <Text style={styles.dateValue}>{request.endDate}</Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Icon
              name="access-time"
              size={moderateScale(13)}
              color={colors.textSecondary}
            />
            <Text style={styles.durationText}>
              {request.days} day{request.days !== 1 ? 's' : ''}
            </Text>
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
            <Text style={[styles.priceValue, { color: colors.error }]}>
              -${request.platformFee}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('deposit_held')}</Text>
            <Text style={styles.priceValue}>${request.deposit}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('you_will_receive')}</Text>
            <Text style={styles.totalValue}>
              ${request.rentalCost - request.platformFee}
            </Text>
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
            <Text style={styles.rejectBtnText}>
              {t('decline_booking_button')}
            </Text>
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
                <Text style={styles.approveBtnText}>
                  {t('approve_booking_title')}
                </Text>
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
                <View
                  style={[
                    styles.radioBtn,
                    selectedReason === reason && styles.radioBtnActive,
                  ]}
                >
                  {selectedReason === reason && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.confirmRejectBtn,
                !selectedReason && styles.btnDisabled,
              ]}
              onPress={handleReject}
              disabled={!selectedReason}
            >
              <Text style={styles.confirmRejectBtnText}>
                {t('confirm_decline_button')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setRejectModal(false)}
            >
              <Text style={styles.cancelBtnText}>{t('cancel_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingRequestDetailScreen;
