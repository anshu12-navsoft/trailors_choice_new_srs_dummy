import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../../Theme/ThemeContext';
import { styles } from '../stylesheets/RenterDashboard.style';

const UPCOMING_BOOKINGS = [
  {
    id: 'B002',
    trailerTitle: 'Enclosed 24ft Cargo',
    startDate: 'Mar 28',
    endDate: 'Apr 1',
    days: 4,
    totalPrice: 480,
    cardColor: '#D1FAE5',
  },
  {
    id: 'B003',
    trailerTitle: 'Car Hauler 18ft',
    startDate: 'Apr 5',
    endDate: 'Apr 6',
    days: 1,
    totalPrice: 115,
    cardColor: '#FCE7F3',
  },
];

const SAVED_TRAILERS = [
  {
    id: '3',
    title: '16ft Flatbed',
    pricePerDay: 60,
    rating: 4.9,
    cardColor: '#FEF3C7',
  },
  {
    id: '6',
    title: 'Boat Trailer 22ft',
    pricePerDay: 55,
    rating: 4.8,
    cardColor: '#CFFAFE',
  },
  {
    id: '8',
    title: '10ft Utility',
    pricePerDay: 35,
    rating: 4.7,
    cardColor: '#ECFDF5',
  },
];

const MONTHLY_SPEND = [
  { month: 'Nov', amount: 90, max: 500 },
  { month: 'Dec', amount: 265, max: 500 },
  { month: 'Jan', amount: 65, max: 500 },
  { month: 'Feb', amount: 280, max: 500 },
  { month: 'Mar', amount: 220, max: 500 },
];

const RenterDashboard = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();

  const ACTIVITY = [
    {
      icon: 'check-circle',
      color: colors.success,
      text: 'Booking confirmed for Enclosed 24ft Cargo',
      time: '2h ago',
    },
    {
      icon: 'payment',
      color: colors.primary,
      text: 'Payment of $480 processed',
      time: '2h ago',
    },
    {
      icon: 'star',
      color: '#F59E0B',
      text: 'You rated 16ft Flatbed Trailer 5 stars',
      time: '3 days ago',
    },
    {
      icon: 'assignment-returned',
      color: '#6B7280',
      text: 'Returned Dump Trailer successfully',
      time: '15 days ago',
    },
    {
      icon: 'verified',
      color: colors.success,
      text: "Driver's license verified",
      time: '1 month ago',
    },
  ];

  const STATS = [
    {
      label: t('total_rentals_stat'),
      value: '8',
      icon: 'receipt-long',
      color: colors.primary,
    },
    {
      label: t('total_spent_stat'),
      value: '$1,240',
      icon: 'attach-money',
      color: colors.success,
    },
    {
      label: t('saved_trailers_stat'),
      value: '3',
      icon: 'favorite',
      color: '#EF4444',
    },
    {
      label: t('avg_rating_stat'),
      value: '4.6',
      icon: 'star',
      color: '#F59E0B',
    },
  ];

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
        <Text style={styles.headerTitle}>{t('renter_dashboard_title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.welcomeInfo}>
            <Text style={styles.welcomeName}>Alex Johnson</Text>
            <Text style={styles.memberSince}>
              {t('member_since', { month: 'Jan 2025' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.verifiedBadge}
            onPress={() => navigation.navigate('DriverVerification')}
          >
            <Icon
              name="verified"
              size={moderateScale(14)}
              color={colors.success}
            />
            <Text style={styles.verifiedText}>Verified</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[
                  styles.statIconWrap,
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

        {/* Upcoming Rentals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('upcoming_rentals_section')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyRentals')}>
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        {UPCOMING_BOOKINGS.map(b => (
          <View key={b.id} style={styles.upcomingCard}>
            <View
              style={[styles.upcomingThumb, { backgroundColor: b.cardColor }]}
            >
              <Icon
                name="local-shipping"
                size={moderateScale(22)}
                color="#9CA3AF"
              />
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle} numberOfLines={1}>
                {b.trailerTitle}
              </Text>
              <Text style={styles.upcomingDates}>
                {b.startDate} – {b.endDate} · {b.days} days
              </Text>
            </View>
            <Text style={styles.upcomingPrice}>${b.totalPrice}</Text>
          </View>
        ))}

        {/* Spending Overview */}
        <Text style={styles.sectionTitle}>
          {t('spending_overview_section')}
        </Text>
        <View style={styles.spendCard}>
          <View style={styles.spendHeader}>
            <View>
              <Text style={styles.spendLabel}>{t('this_month_label')}</Text>
              <Text style={styles.spendAmount}>$220</Text>
            </View>
            <View style={styles.spendDivider} />
            <View>
              <Text style={styles.spendLabel}>{t('last_month_label')}</Text>
              <Text style={styles.spendAmount}>$280</Text>
            </View>
            <View style={styles.spendDivider} />
            <View>
              <Text style={styles.spendLabel}>{t('this_year_label')}</Text>
              <Text style={styles.spendAmount}>$920</Text>
            </View>
          </View>
          <View style={styles.barChart}>
            {MONTHLY_SPEND.map(item => (
              <View key={item.month} style={styles.barItem}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.amount / item.max) * moderateScale(60),
                        backgroundColor:
                          item.month === 'Mar' ? colors.primary : '#BFDBFE',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Saved Trailers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('saved_trailers_section')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedList}
        >
          {SAVED_TRAILERS.map(tr => (
            <TouchableOpacity
              key={tr.id}
              style={styles.savedCard}
              onPress={() =>
                navigation.navigate('RenterTrailerDetail', { trailer: tr })
              }
            >
              <View
                style={[styles.savedThumb, { backgroundColor: tr.cardColor }]}
              >
                <Icon
                  name="local-shipping"
                  size={moderateScale(24)}
                  color="#9CA3AF"
                />
                <Icon
                  name="favorite"
                  size={moderateScale(14)}
                  color="#EF4444"
                  style={styles.heartIcon}
                />
              </View>
              <Text style={styles.savedTitle} numberOfLines={1}>
                {tr.title}
              </Text>
              <View style={styles.savedMeta}>
                <Icon name="star" size={moderateScale(12)} color="#F59E0B" />
                <Text style={styles.savedRating}>{tr.rating}</Text>
              </View>
              <Text style={styles.savedPrice}>${tr.pricePerDay}/day</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>{t('recent_activity_section')}</Text>
        <View style={styles.activityCard}>
          {ACTIVITY.map((item, i) => (
            <View
              key={i}
              style={[
                styles.activityItem,
                i === ACTIVITY.length - 1 && styles.activityItemLast,
              ]}
            >
              <View
                style={[
                  styles.activityIconWrap,
                  { backgroundColor: item.color + '18' },
                ]}
              >
                <Icon
                  name={item.icon}
                  size={moderateScale(16)}
                  color={item.color}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RenterDashboard;
