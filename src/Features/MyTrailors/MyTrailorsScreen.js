import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';

const THUMB_SIZE = Dimensions.get('window').width * 0.3;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../Components/Buttons/CustomButton';
import colors from '../../Constants/Colors';
import Fonts from '../../Theme/Fonts';

/* ── Mock data ──────────────────────────────────────────────────────────── */
const MOCK_TRAILERS = [
  { id: '1', name: 'Tandem Axel', earnings: 1236.00, status: 'pending', rating: null,  reviewCount: null, thumbnail: null },
  { id: '2', name: 'Tandem Axel', earnings: 1236.00, status: 'active',  rating: 4.5,  reviewCount: 55,   thumbnail: null },
  { id: '3', name: 'Tandem Axel', earnings: 1236.00, status: 'inactive',rating: null,  reviewCount: null, thumbnail: null },
  { id: '4', name: 'Tandem Axel', earnings: 1236.00, status: 'active',  rating: 4.5,  reviewCount: 55,   thumbnail: null },
];

/* ── Status config ──────────────────────────────────────────────────────── */
const STATUS_CFG = {
  pending:  { label: 'PENDING',  bg: '#F3F4F6', text: '#6B7280', dot: '#F59E0B' },
  active:   { label: 'ACTIVE',   bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  inactive: { label: 'INACTIVE', bg: '#F3F4F6', text: '#6B7280', dot: '#EF4444' },
};

/* ── Trailer row ────────────────────────────────────────────────────────── */
const TrailerRow = ({ item, onPress, onSchedule, onActivate }) => {
  const cfg = STATUS_CFG[item.status] ?? STATUS_CFG.inactive;
  const earningsLabel = `$${item.earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <Pressable style={styles.row} onPress={onPress}>

      {/* Thumbnail with status dot overlay */}
      <View style={styles.thumbWrapper}>
        <View style={styles.thumb}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <Icon name="image" size={moderateScale(22)} color="#C4C4C4" />
          )}
        </View>
        <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      </View>

      {/* Body — name, earnings, then badge + action on one row */}
      <View style={styles.body}>
        <Text style={styles.trailerName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.earnings}>Earnings: {earningsLabel}</Text>

        {/* Badge + right action on the same row */}
        <View style={styles.bottomRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>

          {item.status === 'active' && item.rating !== null ? (
            <View style={styles.ratingRow}>
              <Icon name="star" size={moderateScale(13)} color="#111827" />
              <Text style={styles.ratingText}>{item.rating} ({item.reviewCount})</Text>
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Post Your Trailer</Text>
        <View style={{ width: moderateScale(22) }} />
      </View>

      <FlatList
        data={trailers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TrailerRow
            item={item}
            onPress={() => navigation.navigate('TrailerDetail', { trailer: item })}
            onSchedule={() => navigation.navigate('AvailabilityCalendar', { trailerId: item.id })}
            onActivate={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="truck-outline" size={moderateScale(48)} color={colors.border} />
            <Text style={styles.emptyTitle}>No trailers yet</Text>
            <Text style={styles.emptySubtitle}>Add your first trailer to start earning</Text>
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
                <Text style={styles.countBadgeText}>{trailers.length} TOTAL</Text>
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

/* ── Styles ─────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  addBtn: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(16),
    backgroundColor: '#000',
    borderRadius: moderateScale(8),
  },

  statsRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(20),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: moderateScale(4),
  },
  statValue: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(10),
  },
  inventoryTitle: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
  },
  countBadgeText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#6B7280',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  listContent: { paddingBottom: moderateScale(32) },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  /* Trailer row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    gap: moderateScale(12),
  },
  dot: {
    position: 'absolute',
    top: -moderateScale(1.2),
    left: -moderateScale(1.2),
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: '#fff',
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: moderateScale(6),
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    gap: moderateScale(4),
  },
  trailerName: {
    fontSize: Fonts.size.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  earnings: {
    fontSize: Fonts.size.sm,
    color: '#6B7280',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(6),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
  ratingText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  /* Empty */
  empty: {
    alignItems: 'center',
    paddingTop: moderateScale(60),
    gap: moderateScale(8),
  },
  emptyTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: Fonts.size.sm,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: moderateScale(40),
  },
});
