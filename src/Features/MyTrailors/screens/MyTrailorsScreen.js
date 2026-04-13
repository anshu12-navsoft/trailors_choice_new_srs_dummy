import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { styles } from '../stylesheets/MyTrailor.style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../Components/Buttons/CustomButton';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';
import CustomHeader from '../../../Components/Header/CustomHeader';
/* ── Mock data ──────────────────────────────────────────────────────────── */
const MOCK_TRAILERS = [
  {
    id: '1',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'pending',
    rating: null,
    reviewCount: null,
    thumbnail: null,
  },
  {
    id: '2',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'active',
    rating: 4.5,
    reviewCount: 55,
    thumbnail: null,
  },
  {
    id: '3',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'inactive',
    rating: null,
    reviewCount: null,
    thumbnail: null,
  },
  {
    id: '4',
    name: 'Tandem Axel',
    earnings: 1236.0,
    status: 'active',
    rating: 4.5,
    reviewCount: 55,
    thumbnail: null,
  },
];

/* ── Status config ──────────────────────────────────────────────────────── */
const STATUS_CFG = {
  pending: { label: 'PENDING', bg: '#F3F4F6', text: '#6B7280', dot: '#F59E0B' },
  active: { label: 'ACTIVE', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  inactive: {
    label: 'INACTIVE',
    bg: '#F3F4F6',
    text: '#6B7280',
    dot: '#EF4444',
  },
};

/* ── Trailer row ────────────────────────────────────────────────────────── */
const TrailerRow = ({ item, onPress, onSchedule, onActivate }) => {
  const cfg = STATUS_CFG[item.status] ?? STATUS_CFG.inactive;
  const earningsLabel = `$${item.earnings.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      {/* Thumbnail with status dot overlay */}
      <View style={styles.thumbWrapper}>
        <View style={styles.thumb}>
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <Icon name="image" size={moderateScale(22)} color="#C4C4C4" />
          )}
        </View>
        <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      </View>

      {/* Body — name, earnings, then badge + action on one row */}
      <View style={styles.body}>
        <Text style={styles.trailerName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.earnings}>Earnings: {earningsLabel}</Text>

        {/* Badge + right action on the same row */}
        <View style={styles.bottomRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.text }]}>
              {cfg.label}
            </Text>
          </View>

          {item.status === 'active' && item.rating !== null ? (
            <View style={styles.ratingRow}>
              <Icon name="star" size={moderateScale(13)} color="#111827" />
              <Text style={styles.ratingText}>
                {item.rating} ({item.reviewCount})
              </Text>
            </View>
          ) : item.status === 'pending' ? (
            <Pressable onPress={onSchedule} hitSlop={8}>
              <Text style={styles.actionText}>SCHEDULE</Text>
            </Pressable>
          ) : item.status === 'inactive' ? (
            <Pressable onPress={onActivate} hitSlop={8}>
              <Text style={styles.actionText}>ACTIVATE</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

/* ── Screen ─────────────────────────────────────────────────────────────── */
const MyTrailorsScreen = ({ navigation }) => {
  const [trailers] = useState(MOCK_TRAILERS);

  const activeCount = trailers.filter(t => t.status === 'active').length;
  const totalRevenue = '4,821.00';

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      {/* Header */}
      <CustomHeader
        title="Post Your Trailer"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={trailers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TrailerRow
            item={item}
            onPress={() =>
              navigation.navigate('TrailerDetail', { trailer: item })
            }
            onSchedule={() =>
              navigation.navigate('AvailabilityCalendar', {
                trailerId: item.id,
              })
            }
            onActivate={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon
              name="truck-outline"
              size={moderateScale(48)}
              color={colors.border}
            />
            <Text style={styles.emptyTitle}>No trailers yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first trailer to start earning
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {/* Add button */}
            <CustomButton
              title="+ Add New Trailer"
              onPress={() => navigation.navigate('AddTrailor')}
              variant="primary"
              size="medium"
              style={styles.addBtn}
            />

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TOTAL REVENUE</Text>
                <Text style={styles.statValue}>${totalRevenue}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>ACTIVE UNITS</Text>
                <Text style={styles.statValue}>{activeCount} Trailers</Text>
              </View>
            </View>

            {/* Inventory heading */}
            <View style={styles.inventoryRow}>
              <Text style={styles.inventoryTitle}>Your Inventory</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {trailers.length} TOTAL
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
          </>
        }
      />
    </SafeAreaView>
  );
};

export default MyTrailorsScreen;
