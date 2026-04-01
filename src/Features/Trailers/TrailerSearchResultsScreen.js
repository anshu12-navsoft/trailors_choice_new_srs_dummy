import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, StyleSheet, StatusBar, TextInput,
  TouchableOpacity, FlatList, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../App/Redux/Slices/trailerSlice';
import colors from '../../Constants/Colors';

const CATEGORIES = ['All', 'Utility', 'Enclosed', 'Flatbed', 'Car Hauler', 'Dump', 'Boat', 'RV'];
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Nearest First', value: 'distance' },
];

const MOCK_RESULTS = [
  { id: '1', title: '20ft Utility Trailer', category: 'Utility', rating: 4.8, reviewCount: 24, distance: 2.3, pricePerDay: 45, instantBook: true, ownerName: 'John D.', ownerRating: 4.9, cardColor: '#DBEAFE' },
  { id: '2', title: 'Enclosed 24ft Cargo', category: 'Enclosed', rating: 4.7, reviewCount: 18, distance: 4.1, pricePerDay: 85, instantBook: false, ownerName: 'Sarah M.', ownerRating: 4.7, cardColor: '#D1FAE5' },
  { id: '3', title: '16ft Flatbed Trailer', category: 'Flatbed', rating: 4.9, reviewCount: 41, distance: 1.8, pricePerDay: 60, instantBook: true, ownerName: 'Mike R.', ownerRating: 5.0, cardColor: '#FEF3C7' },
  { id: '4', title: 'Car Hauler 18ft', category: 'Car Hauler', rating: 4.6, reviewCount: 12, distance: 6.2, pricePerDay: 95, instantBook: true, ownerName: 'Lisa K.', ownerRating: 4.8, cardColor: '#FCE7F3' },
  { id: '5', title: '5x8 Dump Trailer', category: 'Dump', rating: 4.5, reviewCount: 9, distance: 3.5, pricePerDay: 70, instantBook: false, ownerName: 'Tom H.', ownerRating: 4.6, cardColor: '#EDE9FE' },
  { id: '6', title: 'Boat Trailer 22ft', category: 'Boat', rating: 4.8, reviewCount: 31, distance: 5.0, pricePerDay: 55, instantBook: true, ownerName: 'Amy C.', ownerRating: 4.9, cardColor: '#CFFAFE' },
  { id: '7', title: 'RV Hauler Trailer', category: 'RV', rating: 4.4, reviewCount: 7, distance: 8.1, pricePerDay: 110, instantBook: false, ownerName: 'Dave W.', ownerRating: 4.5, cardColor: '#FEE2E2' },
  { id: '8', title: '10ft Utility Trailer', category: 'Utility', rating: 4.7, reviewCount: 55, distance: 0.9, pricePerDay: 35, instantBook: true, ownerName: 'Jen B.', ownerRating: 4.8, cardColor: '#ECFDF5' },
  { id: '9', title: 'Heavy Duty Flatbed', category: 'Flatbed', rating: 4.6, reviewCount: 20, distance: 3.2, pricePerDay: 75, instantBook: false, ownerName: 'Rob P.', ownerRating: 4.7, cardColor: '#FEF9C3' },
  { id: '10', title: 'Enclosed 16ft', category: 'Enclosed', rating: 4.5, reviewCount: 14, distance: 2.7, pricePerDay: 65, instantBook: true, ownerName: 'Nina T.', ownerRating: 4.6, cardColor: '#F0FDF4' },
];

const TrailerCard = ({ item, onPress, onFavorite, isFavorite }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.cardImage, { backgroundColor: item.cardColor }]}>
      <Icon name="local-shipping" size={moderateScale(30)} color="#9CA3AF" />
      {item.instantBook && (
        <View style={styles.instantBadge}>
          <Icon name="bolt" size={moderateScale(10)} color="#fff" />
          <Text style={styles.instantText}>Instant Book</Text>
        </View>
      )}
    </View>
    <View style={styles.cardInfo}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity onPress={onFavorite}>
          <Icon name={isFavorite ? 'favorite' : 'favorite-border'} size={moderateScale(20)} color={isFavorite ? '#EF4444' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.categoryText}>{item.category}</Text>
      <View style={styles.ratingRow}>
        <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
        <Text style={styles.ratingText}>{item.rating} ({item.reviewCount})</Text>
        <Text style={styles.dot}>·</Text>
        <Icon name="place" size={moderateScale(13)} color="#9CA3AF" />
        <Text style={styles.distText}>{item.distance} mi</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${item.pricePerDay}<Text style={styles.perDay}>/day</Text></Text>
        <Text style={styles.ownerText}>by {item.ownerName}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const TrailerSearchResultsScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const initialQuery = route.params?.query ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterModal, setFilterModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(null);
  const [instantOnly, setInstantOnly] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.trailer.favorites);

  const filtered = MOCK_RESULTS.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (minRating && item.rating < minRating) return false;
    if (instantOnly && !item.instantBook) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price_desc') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distance - b.distance;
    return 0;
  });

  const activeFilters = [
    selectedCategory !== 'All' && selectedCategory,
    minRating && `${minRating}+ stars`,
    instantOnly && 'Instant Book',
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Icon name="search" size={moderateScale(18)} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="City, ZIP or trailer type"
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Controls Row */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setFilterModal(true)}>
          <Icon name="tune" size={moderateScale(16)} color={colors.primary} />
          <Text style={styles.controlText}>Filter {activeFilters.length > 0 ? `(${activeFilters.length})` : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setSortModal(true)}>
          <Icon name="sort" size={moderateScale(16)} color={colors.primary} />
          <Text style={styles.controlText}>{SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? 'Sort'}</Text>
        </TouchableOpacity>
        <Text style={styles.resultsCount}>{filtered.length} trailers</Text>
      </View>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeFilters}>
          {activeFilters.map(f => (
            <View key={f} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => { setSelectedCategory('All'); setMinRating(null); setInstantOnly(false); }}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TrailerCard
            item={item}
            onPress={() => navigation.navigate('RenterTrailerDetail', { trailer: item })}
            onFavorite={() => dispatch(toggleFavorite(item.id))}
            isFavorite={favorites.includes(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search-off" size={moderateScale(48)} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No trailers found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search area</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filter Trailers</Text>

            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: moderateScale(16) }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.ratingOptions}>
              {[null, 3, 4, 4.5].map(r => (
                <TouchableOpacity
                  key={String(r)}
                  style={[styles.ratingChip, minRating === r && styles.filterChipActive]}
                  onPress={() => setMinRating(r)}
                >
                  <Text style={[styles.filterChipText, minRating === r && styles.filterChipTextActive]}>
                    {r === null ? 'Any' : `${r}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.toggleRow} onPress={() => setInstantOnly(!instantOnly)}>
              <Text style={styles.filterLabel}>Instant Book Only</Text>
              <View style={[styles.toggle, instantOnly && styles.toggleActive]}>
                <View style={[styles.toggleThumb, instantOnly && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModal(false)}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModal} animationType="slide" transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSortModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.sortOption}
                onPress={() => { setSortBy(opt.value); setSortModal(false); }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.value && styles.sortOptionActive]}>{opt.label}</Text>
                {sortBy === opt.value && <Icon name="check" size={moderateScale(18)} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(10), gap: 8 },
  backBtn: { padding: 4 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: moderateScale(10), borderWidth: 1, borderColor: colors.border, paddingHorizontal: moderateScale(10), height: moderateScale(40), gap: 6 },
  searchInput: { flex: 1, fontSize: moderateScale(14), color: colors.textPrimary },
  controlsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(8), gap: 8, borderBottomWidth: 1, borderColor: colors.border },
  controlBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', borderRadius: moderateScale(8), paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(6) },
  controlText: { fontSize: moderateScale(13), color: colors.primary, fontWeight: '500' },
  resultsCount: { marginLeft: 'auto', fontSize: moderateScale(12), color: colors.textSecondary },
  activeFilters: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(8), gap: 8 },
  activeChip: { backgroundColor: '#DBEAFE', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activeChipText: { fontSize: moderateScale(12), color: colors.primary },
  clearText: { fontSize: moderateScale(12), color: colors.error, fontWeight: '500', paddingVertical: 4 },
  list: { padding: moderateScale(16), gap: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: moderateScale(14), borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardImage: { width: moderateScale(110), alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: moderateScale(100) },
  instantBadge: { position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#16A34A', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  instantText: { fontSize: moderateScale(9), color: '#fff', fontWeight: '600' },
  cardInfo: { flex: 1, padding: moderateScale(12) },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  cardTitle: { flex: 1, fontSize: moderateScale(14), fontWeight: '700', color: colors.textPrimary, marginRight: 8 },
  categoryText: { fontSize: moderateScale(12), color: colors.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  ratingText: { fontSize: moderateScale(12), color: colors.textSecondary },
  dot: { color: colors.textSecondary },
  distText: { fontSize: moderateScale(12), color: colors.textSecondary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: moderateScale(15), fontWeight: '800', color: colors.textPrimary },
  perDay: { fontSize: moderateScale(11), fontWeight: '400', color: colors.textSecondary },
  ownerText: { fontSize: moderateScale(11), color: colors.textSecondary },
  emptyState: { alignItems: 'center', paddingTop: moderateScale(60), gap: 8 },
  emptyTitle: { fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: moderateScale(14), color: colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: moderateScale(20), borderTopRightRadius: moderateScale(20), padding: moderateScale(20), paddingBottom: moderateScale(34) },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: moderateScale(16) },
  modalTitle: { fontSize: moderateScale(18), fontWeight: '700', color: colors.textPrimary, marginBottom: moderateScale(16) },
  filterLabel: { fontSize: moderateScale(14), fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: moderateScale(13), color: colors.textSecondary },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  ratingOptions: { flexDirection: 'row', gap: 8, marginBottom: moderateScale(16) },
  ratingChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(20) },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#D1D5DB', justifyContent: 'center', padding: 2 },
  toggleActive: { backgroundColor: colors.primary },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbActive: { alignSelf: 'flex-end' },
  applyBtn: { backgroundColor: colors.primary, borderRadius: moderateScale(12), paddingVertical: moderateScale(14), alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '700' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: moderateScale(14), borderBottomWidth: 1, borderColor: colors.border },
  sortOptionText: { fontSize: moderateScale(15), color: colors.textPrimary },
  sortOptionActive: { color: colors.primary, fontWeight: '600' },
});

export default TrailerSearchResultsScreen;
