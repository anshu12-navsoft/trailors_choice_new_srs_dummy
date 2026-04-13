import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../../Theme/ThemeContext';
import { styles } from '../stylesheets/OwnerDashboard.style';
import CustomHeader from '../../../Components/Header/CustomHeader';


const ACTIVE_LISTINGS = [
  {
    id: '1',
    name: 'Heavy Duty Flatbed',
    type: 'Flatbed',
    pricePerDay: 85,
    booked: true,
    cardColor: '#FEF3C7',
  },
  {
    id: '2',
    name: 'Enclosed Cargo 7x14',
    type: 'Enclosed',
    pricePerDay: 110,
    booked: false,
    cardColor: '#D1FAE5',
  },
  {
    id: '3',
    name: 'Dump Trailer 14ft',
    type: 'Dump',
    pricePerDay: 150,
    booked: false,
    cardColor: '#EDE9FE',
  },
];

const UPCOMING_BOOKINGS = [
  {
    id: 'R001',
    renterName: 'Alex J.',
    trailerName: 'Heavy Duty Flatbed',
    startDate: 'Mar 28',
    endDate: 'Mar 30',
    totalPrice: 255,
    cardColor: '#FEF3C7',
  },
  {
    id: 'R002',
    renterName: 'Chris P.',
    trailerName: 'Enclosed Cargo 7x14',
    startDate: 'Apr 2',
    endDate: 'Apr 5',
    totalPrice: 440,
    cardColor: '#D1FAE5',
  },
  {
    id: 'R003',
    renterName: 'Maria L.',
    trailerName: 'Dump Trailer 14ft',
    startDate: 'Apr 8',
    endDate: 'Apr 9',
    totalPrice: 300,
    cardColor: '#EDE9FE',
  },
];

const OwnerDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();

  const STATS = [
    {
      label: t('active_listings_section'),
      value: '4',
      icon: 'local-shipping',
      color: colors.primary,
    },
    {
      label: t('bookings_label'),
      value: '31',
      icon: 'receipt-long',
      color: colors.success,
    },
    {
      label: t('monthly_revenue_section'),
      value: '$1,820',
      icon: 'attach-money',
      color: '#F59E0B',
    },
    {
      label: t('avg_rating_stat'),
      value: '4.8',
      icon: 'star',
      color: '#EF4444',
    },
  ];

  const ALERTS = [
    {
      icon: 'pending-actions',
      color: colors.warning,
      text: '2 booking requests awaiting approval',
      action: 'BookingRequests',
    },
    {
      icon: 'rate-review',
      color: colors.primary,
      text: '1 new review from Alex J.',
      action: 'OwnerReviews',
    },
  ];

  const QUICK_ACTIONS = [
    {
      icon: 'add-circle',
      label: t('add_listing_action'),
      route: 'AddTrailor',
      color: colors.primary,
    },
    {
      icon: 'pending-actions',
      label: t('requests_action'),
      route: 'BookingRequests',
      color: colors.warning,
    },
    {
      icon: 'event',
      label: t('calendar_action'),
      route: 'AvailabilityCalendar',
      color: colors.success,
    },
    {
      icon: 'account-balance-wallet',
      label: t('earnings_action'),
      route: 'EarningsDashboard',
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}

      <CustomHeader
        title={t('owner_dashboard_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.welcomeInfo}>
            <Text style={styles.welcomeName}>John D. {t('owner_label')}</Text>
            <Text style={styles.memberSince}>
              {t('member_since', { month: 'Jan 2024' })}
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Icon
              name="verified"
              size={moderateScale(14)}
              color={colors.success}
            />
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
            <Icon
              name={alert.icon}
              size={moderateScale(18)}
              color={alert.color}
            />
            <Text style={styles.alertText}>{alert.text}</Text>
            <Icon
              name="chevron-right"
              size={moderateScale(18)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + '18' },
                ]}
              >
                <Icon
                  name={stat.icon}
                  size={moderateScale(20)}
                  color={stat.color}
                />
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
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + '18' },
                ]}
              >
                <Icon
                  name={action.icon}
                  size={moderateScale(22)}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Listings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('active_listings_section')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyTrailors')}>
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        {ACTIVE_LISTINGS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.listingCard}
            onPress={() =>
              navigation.navigate('TrailerDetail', { trailer: item })
            }
          >
            <View
              style={[styles.listingThumb, { backgroundColor: item.cardColor }]}
            >
              <Icon
                name="local-shipping"
                size={moderateScale(22)}
                color="#9CA3AF"
              />
            </View>
            <View style={styles.listingInfo}>
              <Text style={styles.listingName}>{item.name}</Text>
              <Text style={styles.listingType}>{item.type}</Text>
            </View>
            <View style={styles.listingRight}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.booked ? '#DBEAFE' : '#F0FDF4' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: item.booked ? colors.primary : colors.success },
                  ]}
                >
                  {item.booked ? t('booked_status') : t('available_status')}
                </Text>
              </View>
              <Text style={styles.listingPrice}>${item.pricePerDay}/day</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Upcoming Bookings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('upcoming_bookings_section')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('OwnerBookings')}
          >
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        {UPCOMING_BOOKINGS.map(b => (
          <View key={b.id} style={styles.bookingCard}>
            <View
              style={[styles.bookingThumb, { backgroundColor: b.cardColor }]}
            >
              <Icon
                name="local-shipping"
                size={moderateScale(20)}
                color="#9CA3AF"
              />
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingRenter}>{b.renterName}</Text>
              <Text style={styles.bookingTrailer} numberOfLines={1}>
                {b.trailerName}
              </Text>
              <Text style={styles.bookingDates}>
                {b.startDate} – {b.endDate}
              </Text>
            </View>
            <Text style={styles.bookingPrice}>${b.totalPrice}</Text>
          </View>
        ))}

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerDashboard;
