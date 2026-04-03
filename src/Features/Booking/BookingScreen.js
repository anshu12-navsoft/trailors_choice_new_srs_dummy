import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import colors from '../../Constants/Colors';
import { styles } from './Booking.style';

const PICKUP_TIMES = [
  { label: '8:00 AM', value: '08:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '4:00 PM', value: '16:00' },
];

const daysBetween = (d1, d2) => {
  if (!d1 || !d2) return 0;
  const diff = new Date(d2) - new Date(d1);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BookingScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const trailer = route.params?.trailer ?? {};
  const pricePerDay = trailer.pricePerDay ?? 45;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingDate, setSelectingDate] = useState('start');
  const [loading, setLoading] = useState(false);

  const days = daysBetween(startDate, endDate);
  const rentalCost = pricePerDay * (days || 1);
  const platformFee = Math.round(rentalCost * 0.11);
  const deposit = 150;
  const total = rentalCost + platformFee + deposit;

  const markedDates = {};
  if (startDate)
    markedDates[startDate] = {
      selected: true,
      startingDay: true,
      color: colors.primary,
    };
  if (endDate)
    markedDates[endDate] = {
      selected: true,
      endingDay: true,
      color: colors.primary,
    };
  if (startDate && endDate) {
    let cur = new Date(startDate);
    cur.setDate(cur.getDate() + 1);
    const end = new Date(endDate);
    while (cur < end) {
      const k = cur.toISOString().split('T')[0];
      markedDates[k] = {
        selected: true,
        color: '#BFDBFE',
        textColor: colors.primary,
      };
      cur.setDate(cur.getDate() + 1);
    }
  }

  const handleDateSelect = day => {
    if (selectingDate === 'start') {
      setStartDate(day.dateString);
      setEndDate('');
      setSelectingDate('end');
    } else {
      if (day.dateString <= startDate) {
        setStartDate(day.dateString);
        setEndDate('');
        setSelectingDate('end');
      } else {
        setEndDate(day.dateString);
        setCalendarVisible(false);
        setSelectingDate('start');
      }
    }
  };

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Missing Dates', 'Please select pickup and return dates.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('BookingConfirmation', {
        booking: {
          id: `TRL-2025-${Math.floor(100000 + Math.random() * 900000)}`,
          trailer,
          startDate,
          endDate,
          pickupTime,
          days,
          rentalCost,
          platformFee,
          deposit,
          total,
          notes,
          ownerName: trailer.ownerName ?? 'John D.',
          ownerRating: trailer.ownerRating ?? 4.9,
          address: '123 Oak Lane, Austin, TX 78701',
        },
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
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
        <Text style={styles.headerTitle}>{t('book_trailer_title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Trailer Summary */}
        <View style={styles.trailerCard}>
          <View
            style={[
              styles.trailerThumb,
              { backgroundColor: trailer.cardColor ?? '#DBEAFE' },
            ]}
          >
            <Icon
              name="local-shipping"
              size={moderateScale(28)}
              color="#9CA3AF"
            />
          </View>
          <View style={styles.trailerInfo}>
            <Text style={styles.trailerTitle} numberOfLines={1}>
              {trailer.title ?? '20ft Utility Trailer'}
            </Text>
            <Text style={styles.trailerCategory}>
              {trailer.category ?? 'Utility'}
            </Text>
            <View style={styles.ownerRow}>
              <Icon
                name="person"
                size={moderateScale(13)}
                color={colors.textSecondary}
              />
              <Text style={styles.ownerText}>
                {trailer.ownerName ?? 'John D.'}
              </Text>
              <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
              <Text style={styles.ownerText}>{trailer.ownerRating ?? 4.9}</Text>
            </View>
          </View>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>${pricePerDay}/day</Text>
          </View>
        </View>

        {/* Rental Period */}
        <Text style={styles.sectionTitle}>{t('rental_period_section')}</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              setSelectingDate('start');
              setCalendarVisible(true);
            }}
          >
            <Icon
              name="today"
              size={moderateScale(18)}
              color={colors.primary}
            />
            <View>
              <Text style={styles.dateBtnLabel}>{t('pickup_date_label')}</Text>
              <Text style={styles.dateBtnValue}>
                {startDate
                  ? formatDate(startDate)
                  : t('pickup_date_placeholder')}
              </Text>
            </View>
          </TouchableOpacity>
          <Icon
            name="arrow-forward"
            size={moderateScale(18)}
            color={colors.textSecondary}
          />
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              setSelectingDate('end');
              setCalendarVisible(true);
            }}
          >
            <Icon
              name="event"
              size={moderateScale(18)}
              color={colors.primary}
            />
            <View>
              <Text style={styles.dateBtnLabel}>{t('return_date_label')}</Text>
              <Text style={styles.dateBtnValue}>
                {endDate ? formatDate(endDate) : t('return_date_placeholder')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {days > 0 && (
          <View style={styles.durationChip}>
            <Icon
              name="access-time"
              size={moderateScale(14)}
              color={colors.primary}
            />
            <Text style={styles.durationText}>
              {t('days_rental', { days })}
            </Text>
          </View>
        )}

        {/* Pickup Time */}
        <Text style={styles.fieldLabel}>{t('pickup_time_section')}</Text>
        <View style={styles.timeOptions}>
          {PICKUP_TIMES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.timeChip,
                pickupTime === t.value && styles.timeChipActive,
              ]}
              onPress={() => setPickupTime(t.value)}
            >
              <Text
                style={[
                  styles.timeChipText,
                  pickupTime === t.value && styles.timeChipTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Breakdown */}
        <Text style={styles.sectionTitle}>{t('price_breakdown_section')}</Text>
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${pricePerDay} × {days || 1} day{(days || 1) !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.priceValue}>${rentalCost}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('platform_fee')}</Text>
            <Text style={styles.priceValue}>${platformFee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('refundable_deposit')}</Text>
            <Text style={styles.priceValue}>${deposit}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('total_label')}</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
          <View style={styles.depositNote}>
            <Icon
              name="info-outline"
              size={moderateScale(13)}
              color={colors.textSecondary}
            />
            <Text style={styles.depositNoteText}>
              {t('deposit_refunded_message')}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>{t('payment_method_section')}</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <Icon
            name="credit-card"
            size={moderateScale(20)}
            color={colors.primary}
          />
          <Text style={styles.paymentText}>{t('visa_card')}</Text>
          <View style={styles.selectedDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCardBtn}>
          <Icon
            name="add-circle-outline"
            size={moderateScale(18)}
            color={colors.primary}
          />
          <Text style={styles.addCardText}>{t('add_new_card')}</Text>
        </TouchableOpacity>

        {/* Driver Verification Status */}
        <View style={styles.verificationCard}>
          <Icon
            name="verified-user"
            size={moderateScale(20)}
            color={colors.success}
          />
          <View style={styles.verificationInfo}>
            <Text style={styles.verificationTitle}>
              {t('drivers_license_verification')}
            </Text>
            <Text style={styles.verificationStatus}>
              {t('drivers_license_verified')}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <Text style={styles.fieldLabel}>{t('special_instructions_label')}</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('special_instructions_placeholder')}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
        />

        <View style={{ height: moderateScale(20) }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotal}>${total} total</Text>
          <Text style={styles.footerNote}>Includes deposit</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>
                {t('confirm_booking_button')}
              </Text>
              <Icon name="check" size={moderateScale(18)} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal visible={calendarVisible} animationType="slide" transparent>
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarSheet}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>
                {selectingDate === 'start'
                  ? 'Select Pickup Date'
                  : 'Select Return Date'}
              </Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Icon
                  name="close"
                  size={moderateScale(22)}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              markingType="period"
              markedDates={markedDates}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                selectedDayBackgroundColor: colors.primary,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingScreen;
