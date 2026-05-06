import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../../Components/Header/CustomHeader';
import { styles } from '../stylesheets/MyTrailerList.style';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTrailers } from '../../../App/Redux/Slices/addTrailerSlice';
import colors from '../../../Constants/Colors';

const LIMIT = 10;

const STATUS_MAP = {
  All: '',
  Active: 'active',
  Inactive: 'inactive',
  Draft: 'draft',
};

const STATUS_CFG = {
  pending: { label: 'DRAFT', bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
  active: { label: 'ACTIVE', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  inactive: { label: 'INACTIVE', bg: '#F3F4F6', text: '#6B7280', dot: '#EF4444' },
  draft: { label: 'DRAFT', bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
};

const TrailerRow = ({ item, onPress, onBookingsPress, onEditPress }) => {
  const cfg = STATUS_CFG[item.trailer_status] ?? STATUS_CFG.inactive;
  const displayName = item.title || item.makeModel || item.name || 'Trailer';
  const thumbnail = item.thumbnail || item.mediaPhotoUrls?.[0] || null;
  const earnings = item.earnings ?? 0;
  const earningsLabel = `$${earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const activeBookingsCount = item.activeBookings ?? 0;
  const isDraft = item.trailer_status === 'draft' || item.trailer_status === 'pending';

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.topSection}>
        <View style={styles.row}>
          <View style={styles.thumbWrapper}>
            <View style={styles.thumb}>
              {thumbnail ? (
                <Image
                  source={{ uri: thumbnail }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              ) : (
                <Icon name="image" size={moderateScale(22)} color="#C4C4C4" />
              )}
            </View>
            <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
          </View>

          <View style={styles.body}>
            <View style={listStyles.titleRow}>
              <Text style={[styles.title, { flex: 1 }]}>{displayName}</Text>
              {isDraft && (
                <Pressable
                  onPress={onEditPress}
                  hitSlop={moderateScale(8)}
                  style={listStyles.editBtn}
                >
                  <Icon name="pencil" size={moderateScale(18)} color="#2563EB" />
                </Pressable>
              )}
            </View>
            <Text style={styles.earnings}>Earnings: {earningsLabel}</Text>

            <View style={styles.bottomRow}>
              <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.badgeText, { color: cfg.text }]}>
                  {cfg.label}
                </Text>
              </View>

              {item.trailer_status === 'active' && item.rating != null && (
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="#F97316" />
                  <Text style={styles.ratingText}>
                    {item.rating} ({item.reviewCount})
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>

      {item.trailer_status === 'active' && (
        <>
          <View style={styles.divider} />
          <Pressable onPress={onBookingsPress} style={styles.bottomStrip}>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingText}>
                {activeBookingsCount} Active Bookings
              </Text>
              <Icon name="chevron-right" size={18} color="#2563EB" />
            </View>
          </Pressable>
        </>
      )}
    </View>
  );
};

const MyTrailorsListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { myTrailers, myTrailersHasMore, loading } = useSelector(
    state => state.addTrailer,
  );
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFirstMount = useRef(true);

  const doFetch = useCallback(
    (tab, pg) => {
      dispatch(fetchMyTrailers({ status: STATUS_MAP[tab], page: pg, limit: LIMIT }));
    },
    [dispatch],
  );

  // Refresh list every time the screen comes into focus (navigate back, tab switch, etc.)
  useFocusEffect(
    useCallback(() => {
      isFirstMount.current = true;
      setPage(1);
      doFetch(activeTab, 1);
    }, [activeTab, doFetch]),
  );

  // Tab change — reset to page 1 and re-fetch
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setPage(1);
    doFetch(activeTab, 1);
  }, [activeTab, doFetch]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !myTrailersHasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    dispatch(
      fetchMyTrailers({ status: STATUS_MAP[activeTab], page: nextPage, limit: LIMIT }),
    ).finally(() => setLoadingMore(false));
  }, [loading, loadingMore, myTrailersHasMore, page, activeTab, dispatch]);

  const renderItem = useCallback(
    ({ item }) => (
      <TrailerRow
        item={item}
        onPress={() => navigation.navigate('TrailerDetail', { trailer: item })}
        onBookingsPress={() =>
          navigation.navigate('MyRecentBooking', { trailerId: item.id })
        }
        onEditPress={() =>
          navigation.navigate('AddTrailor', { trailerId: item.id })
        }
      />
    ),
    [navigation],
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginVertical: moderateScale(16) }}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={listStyles.emptyWrap}>
        <Icon name="truck-outline" size={moderateScale(48)} color="#D1D5DB" />
        <Text style={listStyles.emptyText}>No trailers found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader title="My Trailers" onBack={() => navigation.goBack()} />

      {/* Sticky tab bar */}
      <View style={[styles.toggle, listStyles.tabBar]}>
        {['All', 'Active', 'Inactive', 'Draft'].map(tab => (
          <Pressable
            key={tab}
            style={[styles.toggleTab, activeTab === tab && styles.toggleTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === tab && styles.toggleTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={myTrailers}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
};

const listStyles = StyleSheet.create({
  tabBar: {
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4),
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: moderateScale(60),
    gap: moderateScale(12),
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: '#9CA3AF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(2),
  },
  editBtn: {
    padding: moderateScale(4),
    marginLeft: moderateScale(6),
  },
});

export default MyTrailorsListScreen;
