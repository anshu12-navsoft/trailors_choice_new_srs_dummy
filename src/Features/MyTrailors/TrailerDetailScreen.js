import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Switch,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../Constants/Colors';
import Fonts from '../../Theme/Fonts';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = moderateScale(12);
const CARD_PADDING = moderateScale(16);
const CARD_WIDTH = SCREEN_W - CARD_PADDING * 2 - moderateScale(30); // 30px peek on right

// ── Mock data (replace with route.params in production) ───────────────────
const MOCK_TRAILER = {
  id: '1',
  name: 'Tandem Axel',
  status: 'active',
  address: '1500 Marilla St, Dallas, TX 75201',
  dimensions: "5'x3', 2000 lbs",
  pricing: { daily: 50, weekly: 150, monthly: 450 },
  photos: [null, null],
  listingVisible: true,
  availability: '3 Mar - 31 Mar, 10 Apr - 20 Apr, 1 May - 21 May ...',
  specs: [
    { label: 'Length', value: "8'" },
    { label: 'Width', value: "5'" },
    { label: 'Height off the ground', value: "6'" },
    { label: 'Total height', value: '100kg' },
    { label: 'Weight Capacity', value: '500lb' },
    { label: 'Tounge Weight', value: '200lb' },
    { label: 'Make and Model', value: 'CAT 23658' },
    { label: 'Hitch Type', value: 'Bumper Pull' },
    { label: 'Hitch Class', value: 'Class I, II' },
    { label: 'Ball Type', value: '1-7/8" Ball' },
    { label: 'Ball size', value: '1-7/8" Ball' },
  ],
};

const BOOKINGS = [
  {
    id: '1',
    name: 'James Wilson',
    pickup: 'Feb 24, 10:00 AM',
    status: 'In Progress',
    sub: 'Return Tomorrow',
  },
  {
    id: '2',
    name: 'Michael Johnson',
    pickup: 'Feb 28, 10:00 AM',
    status: 'Confirmed',
    sub: '3 Days Rental',
  },
];

const BAR_DATA = [38, 55, 70, 45, 90, 60, 48]; // % heights

const PREVIEW_SPECS = 6;

// ── Sub-components ────────────────────────────────────────────────────────

const PricePill = ({ amount, unit }) => (
  <View style={pill.wrap}>
    <Text style={pill.amount}>${amount}</Text>
    <Text style={pill.unit}>/{unit}</Text>
  </View>
);

const pill = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'baseline', marginRight: moderateScale(18) },
  amount: { fontSize: Fonts.size.xl, fontWeight: '800', color: colors.textPrimary },
  unit: { fontSize: Fonts.size.sm, color: colors.textSecondary, marginLeft: 2 },
});

const BarChart = () => (
  <View style={chart.container}>
    {BAR_DATA.map((h, i) => (
      <View key={i} style={chart.barWrap}>
        <View style={[chart.bar, { height: `${h}%` }]} />
      </View>
    ))}
  </View>
);

const chart = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: verticalScale(100),
    gap: moderateScale(6),
    paddingTop: moderateScale(8),
  },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: colors.border, borderRadius: moderateScale(4) },
});

const BookingCard = ({ item }) => {
  const isInProgress = item.status === 'In Progress';
  return (
    <View style={bk.card}>
      <View style={bk.avatar} />
      <View style={bk.info}>
        <Text style={bk.name}>{item.name}</Text>
        <Text style={bk.pickup}>Pickup: {item.pickup}</Text>
      </View>
      <View style={bk.right}>
        <Text style={[bk.status, isInProgress && bk.statusActive]}>{item.status}</Text>
        <Text style={bk.sub}>{item.sub}</Text>
      </View>
    </View>
  );
};

const bk = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
    gap: moderateScale(12),
    backgroundColor: colors.background,
  },
  avatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.border,
  },
  info: { flex: 1 },
  name: { fontSize: Fonts.size.md, fontWeight: '600', color: colors.textPrimary },
  pickup: { fontSize: Fonts.size.xs, color: colors.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 2 },
  status: { fontSize: Fonts.size.xs, fontWeight: '600', color: colors.textSecondary },
  statusActive: { color: colors.textPrimary },
  sub: { fontSize: Fonts.size.xs, color: colors.textSecondary },
});

const SpecRow = ({ label, value, dimmed }) => (
  <View style={sp.row}>
    <Text style={[sp.label, dimmed && sp.dimmed]}>{label}</Text>
    <Text style={[sp.value, dimmed && sp.dimmed]}>{value}</Text>
  </View>
);

const sp = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
  },
  label: { fontSize: Fonts.size.sm, color: colors.textSecondary, flex: 1 },
  value: { fontSize: Fonts.size.sm, color: colors.textPrimary, fontWeight: '500', flex: 1 },
  dimmed: { color: colors.textDisabled },
});

// ── Main Screen ───────────────────────────────────────────────────────────
const TrailerDetailScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const trailer = { ...MOCK_TRAILER, ...(route?.params?.trailer ?? {}) };
  const [visible, setVisible] = useState(trailer.listingVisible);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const displayedSpecs = showAllSpecs
    ? trailer.specs
    : trailer.specs.slice(0, PREVIEW_SPECS);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.headerBtn}>
          <Icon name="arrow-left" size={moderateScale(22)} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Trailer</Text>
        <Pressable hitSlop={10} style={styles.headerBtn}>
          <Icon name="more-horizontal" size={moderateScale(22)} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Photo carousel ── */}
        <FlatList
          data={trailer.photos}
          keyExtractor={(_, i) => String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: CARD_PADDING }}
          ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
          style={styles.carousel}
          renderItem={({ item }) => (
            <View style={styles.photoSlide}>
              {item ? (
                <Image source={{ uri: item }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="image" size={moderateScale(32)} color={colors.textDisabled} />
                </View>
              )}
            </View>
          )}
        />

        <View style={styles.body}>

          {/* ── Name + status ── */}
          <View style={styles.nameRow}>
            <Text style={styles.trailerName}>{trailer.name}</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{trailer.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.address}>{trailer.address}</Text>
          <Text style={styles.dimensions}>{trailer.dimensions}</Text>

          {/* ── Pricing ── */}
          <View style={styles.pricingRow}>
            <PricePill amount={trailer.pricing.daily} unit="Daily" />
            <PricePill amount={trailer.pricing.weekly} unit="Weekly" />
            <PricePill amount={trailer.pricing.monthly} unit="Monthly" />
          </View>

          {/* ── Listing Visibility ── */}
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{t('listing_visibility')}</Text>
              <Text style={styles.cardSub}>{t('pause_rentals')}</Text>
            </View>
            <Switch
              value={visible}
              onValueChange={setVisible}
              trackColor={{ false: colors.border, true: colors.textPrimary }}
              thumbColor="#fff"
            />
          </View>

          {/* ── Scheduled Availability ── */}
          <Pressable style={[styles.card, styles.cardRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t('scheduled_availability')}</Text>
              <Text style={styles.cardSub} numberOfLines={1}>{trailer.availability}</Text>
            </View>
            <Icon name="chevron-right" size={moderateScale(18)} color={colors.textSecondary} />
          </Pressable>

          {/* ── Listing Performance ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('listing_performance')}</Text>
              <Pressable style={styles.periodPicker}>
                <Text style={styles.periodText}>{t('last_30_days')}</Text>
                <Icon name="chevron-down" size={moderateScale(14)} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.perfBox}>
              <View style={styles.statsRow}>
                {[
                  { labelKey: 'views_label', value: '1,234' },
                  { labelKey: 'bookings_label', value: '42' },
                  { labelKey: 'earnings_label', value: '$2.4k' },
                ].map((s, i) => (
                  <React.Fragment key={s.labelKey}>
                    {i > 0 && <View style={styles.statDivider} />}
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>{t(s.labelKey)}</Text>
                      <Text style={styles.statValue}>{s.value}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>

              <View style={styles.chartBox}>
                <BarChart />
              </View>
            </View>
          </View>

          {/* ── Active Bookings ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('active_bookings')}</Text>
              <Pressable>
                <Text style={styles.seeAll}>{t('see_all_bookings')}</Text>
              </Pressable>
            </View>
            <View style={{ marginTop: moderateScale(10) }}>
              {BOOKINGS.map(b => <BookingCard key={b.id} item={b} />)}
            </View>
          </View>

          {/* ── Trailer Specification ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('trailer_specification')}</Text>
            <View style={{ marginTop: moderateScale(14) }}>
              {displayedSpecs.map((s, i) => (
                <SpecRow
                  key={i}
                  label={s.label}
                  value={s.value}
                  dimmed={i === displayedSpecs.length - 1 && !showAllSpecs && trailer.specs.length > PREVIEW_SPECS}
                />
              ))}
            </View>
            {trailer.specs.length > PREVIEW_SPECS && (
              <Pressable style={styles.viewAllBtn} onPress={() => setShowAllSpecs(v => !v)}>
                <Text style={styles.viewAllText}>
                  {showAllSpecs ? t('view_less_specs') : t('view_all_specs')}
                </Text>
              </Pressable>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  headerBtn: { width: moderateScale(36) },
  headerTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  scroll: { paddingBottom: moderateScale(40) },

  // carousel
  carousel: { height: verticalScale(220), marginTop: moderateScale(20) },
  photoSlide: {
    width: CARD_WIDTH,
    height: verticalScale(220),
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) },

  // name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(4),
  },
  trailerName: {
    fontSize: Fonts.size.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  activeBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeBadgeText: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  address: { fontSize: Fonts.size.sm, color: colors.textSecondary, marginBottom: 2 },
  dimensions: { fontSize: Fonts.size.sm, color: colors.textSecondary, marginBottom: moderateScale(12) },

  // pricing
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },

  // cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
  },
  cardRow: { gap: moderateScale(12) },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: Fonts.size.md, fontWeight: '600', color: colors.textPrimary },
  cardSub: { fontSize: Fonts.size.xs, color: colors.textSecondary, marginTop: 2 },

  // section
  section: {
    marginTop: moderateScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  sectionTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  periodPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  periodText: { fontSize: Fonts.size.sm, color: colors.textSecondary },

  perfBox: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginTop: moderateScale(10),
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: moderateScale(4),
    marginBottom: moderateScale(8),
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: moderateScale(32), backgroundColor: colors.border },
  statLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Fonts.size.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  chartBox: {
    marginTop: moderateScale(8),
  },

  // bookings
  bookingsList: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // view all specs
  viewAllBtn: {
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: Fonts.size.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default TrailerDetailScreen;
