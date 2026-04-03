import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Constants/Colors';
import { styles } from './BookingConfirmation.style';

const formatDate = dateStr => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const booking = route.params?.booking ?? {};

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My trailer booking is confirmed! Ref: ${
          booking.id
        }. Pickup: ${formatDate(booking.startDate)}`,
      });
    } catch {
      Alert.alert('Share', 'Sharing is not available.');
    }
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Icon
              name="check-circle"
              size={moderateScale(72)}
              color={colors.success}
            />
          </View>
          <Text style={styles.successTitle}>
            {t('booking_confirmed_title')}
          </Text>
          <Text style={styles.successSubtitle}>
            {t('booking_confirmed_message')}
          </Text>
        </View>

        {/* Booking Reference */}
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>{t('booking_reference_label')}</Text>
          <Text style={styles.refNumber}>
            {booking.id ?? 'TRL-2025-001234'}
          </Text>
        </View>

        {/* Booking Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('booking_summary_title')}</Text>
          <View style={styles.summaryRow}>
            <Icon
              name="local-shipping"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.summaryLabel}>{t('trailer_label')}</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {booking.trailer?.title ?? '20ft Utility Trailer'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon
              name="category"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.summaryLabel}>{t('category_label')}</Text>
            <Text style={styles.summaryValue}>
              {booking.trailer?.category ?? 'Utility'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon
              name="today"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.summaryLabel}>{t('pickup_label')}</Text>
            <Text style={styles.summaryValue}>
              {formatDate(booking.startDate)} ·{' '}
              {booking.pickupTime ?? '10:00 AM'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon
              name="event"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.summaryLabel}>{t('return_label')}</Text>
            <Text style={styles.summaryValue}>
              {formatDate(booking.endDate)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Icon
              name="attach-money"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.summaryLabel}>{t('total_paid_label')}</Text>
            <Text style={[styles.summaryValue, styles.totalPaid]}>
              ${booking.total ?? 300}
            </Text>
          </View>
        </View>

        {/* Pickup Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('pickup_instructions_title')}</Text>
          <View style={styles.addressRow}>
            <Icon
              name="place"
              size={moderateScale(18)}
              color={colors.primary}
            />
            <Text style={styles.addressText}>
              {booking.address ?? '123 Oak Lane, Austin, TX 78701'}
            </Text>
          </View>
          <View style={styles.instructionNote}>
            <Icon
              name="info-outline"
              size={moderateScale(14)}
              color={colors.textSecondary}
            />
            <Text style={styles.instructionText}>
              {t('pickup_time_within_15_minutes')}
            </Text>
          </View>
          <TouchableOpacity style={styles.directionsBtn}>
            <Icon
              name="directions"
              size={moderateScale(16)}
              color={colors.primary}
            />
            <Text style={styles.directionsBtnText}>
              {t('get_directions_button')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Owner Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('owner_contact_title')}</Text>
          <View style={styles.ownerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(booking.ownerName ?? 'J')[0]}
              </Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>
                {booking.ownerName ?? 'John D.'}
              </Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
                <Text style={styles.ownerRating}>
                  {booking.ownerRating ?? 4.9} · {t('verified_owner')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.msgBtn}
              onPress={() => navigation.navigate('Messages')}
            >
              <Icon
                name="chat-bubble-outline"
                size={moderateScale(16)}
                color="#fff"
              />
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
          <Text style={styles.primaryBtnText}>
            {t('view_my_rentals_button')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleShare}>
          <Icon name="share" size={moderateScale(18)} color={colors.primary} />
          <Text style={styles.outlineBtnText}>{t('share_booking_button')}</Text>
        </TouchableOpacity>

        <Text style={styles.emailNote}>{t('email_confirmation_note')}</Text>

        <View style={{ height: moderateScale(20) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingConfirmationScreen;
