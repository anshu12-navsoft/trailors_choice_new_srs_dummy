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
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import colors from '../../../Constants/Colors';
import { styles } from '../stylesheets/Booking.style';
import CustomHeader from '../../../Components/Header/CustomHeader';

import { Divider } from 'react-native-paper';
import CustomCalender from '../../../Components/Calender/CustomCalender';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { green } from 'react-native-reanimated/lib/typescript/Colors';
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
const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];
const formatDateTime = (dateStr, time) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day, 10)} ${
    MONTHS[parseInt(month, 10) - 1]
  } ${year}, ${time}`;
};

const BookingConfirmationScreen = ({ navigation, route }) => {
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

  const handlePaymentSuccess = () => {
    navigation.navigate('MyRentals');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader onBack={() => navigation.goBack()} />
      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(10),
        }}
      >
        <View
          style={{
            paddingTop: moderateScale(10),
            paddingBottom: moderateScale(10),
          }}
        >
          <View
            style={{
              flexDirection: 'row',

              gap: moderateScale(8),
            }}
          >
            <TouchableOpacity>
              <Icon
                name="done"
                size={moderateScale(30)}
                color="green"
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: moderateScale(18),
                  fontWeight: '600',
                  color: 'green',
                }}
              >
                Your trailor is booked
              </Text>

              <Text style={{ fontSize: moderateScale(13) }}>
                Your order is confirmed and ready to drive
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerTotal}>Order Summary</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Trailer Summary */}
        <View style={styles.trailerCard}>
          <View style={styles.InfoTrailor}>
            <View
              style={[
                styles.trailerThumb,
                { backgroundColor: trailer.cardColor ?? '#DBEAFE' },
              ]}
            >
              <Icon
                name="local-shipping"
                size={moderateScale(48)}
                color="#9CA3AF"
              />
            </View>
            <View style={styles.trailerInfo}>
              <Text style={styles.trailerTitle} numberOfLines={1}>
                {trailer.title ?? '20ft Utility Trailer'}
              </Text>
              <Text style={styles.trailerCategory}>
                {trailer.ownerName ?? '2.4 miles away - E 8th St.'}
              </Text>
              <Text style={styles.ownerCapacityText}>
                {trailer.ownerName ?? '5`* 3`,2000 lbs '}
              </Text>
              <View style={styles.ownerRow}>
                <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
                <Text style={styles.ownerRatingText}>
                  {trailer.ownerRating ?? 4.5}(55)
                </Text>
              </View>
            </View>
          </View>
          <Divider
            style={{
              marginTop: moderateScale(10),
              marginBottom: moderateScale(10),
            }}
          />

          <Pressable
            style={[styles.Rentercard, styles.RentercardRow]}
            onPress={() => setCalendarVisible(true)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.RentercardTitle}>Start & End Date</Text>
              <Text style={styles.RentercardSub} numberOfLines={1}>
                {startDate && endDate
                  ? `${formatDateTime(startDate, '9:00 am')} - ${formatDateTime(
                      endDate,
                      '9:00 pm',
                    )}`
                  : trailer.availability ?? 'Select dates'}
              </Text>
            </View>
            <Icon
              name="edit"
              size={moderateScale(18)}
              color={colors.textSecondary}
            />
          </Pressable>
          <Divider
            style={{
              marginTop: moderateScale(10),
              marginBottom: moderateScale(10),
            }}
          />
          <View>
            <Text style={styles.locationCardTitle}>
              Pickup &amp; Return Location
            </Text>
            <View style={styles.locationAddressRow}>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {trailer.address ?? '1500 Marilla St, Dallas, TX 75201'}
              </Text>
              <TouchableOpacity>
                <Icon
                  name="edit"
                  size={moderateScale(18)}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <Text style={styles.sectionTitle}>{t('price_breakdown_section')}</Text>
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>4 days * $50</Text>
            <Text style={styles.priceValue}>$200</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes/fees</Text>
            <Text style={styles.priceValue}>$150.12</Text>
          </View>
          <Divider />
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('total_label')}</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
          <Divider />
        </View>

        <View style={{ height: moderateScale(20) }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <CustomButton
          onPress={handlePaymentSuccess}
          title={'Continue to Payment'}
          size="medium"
          style={{ width: '100%' }}
        />
      </View>

      {/* Calendar Modal */}
      <CustomCalender
        visible={calendarVisible}
        startDate={startDate}
        endDate={endDate}
        onChange={({ startDate: s, endDate: e }) => {
          setStartDate(s);
          setEndDate(e);
        }}
        onClose={() => setCalendarVisible(false)}
      />
    </SafeAreaView>
  );
};

export default BookingConfirmationScreen;
