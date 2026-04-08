import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../Constants/Colors';
import { styles } from '../stylesheets/TrailorSearchResult.style';
const CATEGORIES = [
  'All',
  'Utility',
  'Enclosed',
  'Flatbed',
  'Car Hauler',
  'Dump',
  'Boat',
  'RV',
];
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Nearest First', value: 'distance' },
];

const MOCK_RESULTS = [
  {
    id: '1',
    title: 'Tandem Axel',
    category: 'Utility',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
  {
    id: '2',
    title: 'Tandem Axel',
    category: 'Enclosed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: false,
  },
  {
    id: '3',
    title: 'Tandem Axel',
    category: 'Flatbed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
  {
    id: '4',
    title: 'Tandem Axel',
    category: 'Car Hauler',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
  {
    id: '5',
    title: 'Tandem Axel',
    category: 'Dump',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: false,
  },
  {
    id: '6',
    title: 'Tandem Axel',
    category: 'Boat',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
  {
    id: '7',
    title: 'Tandem Axel',
    category: 'RV',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: false,
  },
  {
    id: '8',
    title: 'Tandem Axel',
    category: 'Utility',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
  {
    id: '9',
    title: 'Tandem Axel',
    category: 'Flatbed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: false,
  },
  {
    id: '10',
    title: 'Tandem Axel',
    category: 'Enclosed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: '5x3, 2000 lbs',
    pricePerDay: 50,
    instantBook: true,
  },
];

const TrailerCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.cardImage}>
      <Icon name="image" size={moderateScale(32)} color="#C4C4C4" />
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardSubtitle}>
        {item.distance} miles away · {item.street}
      </Text>
      <Text style={styles.cardSpecs}>{item.specs}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          ${item.pricePerDay}
          <Text style={styles.perDay}>/day</Text>
        </Text>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviewCount})
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const TrailerSearchResultsScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const initialQuery = route.params?.query ?? '';
  const [query] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterModal, setFilterModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(null);
  const [instantOnly, setInstantOnly] = useState(false);
  const [expandedSection, setExpandedSection] = useState('category');

  const filtered = MOCK_RESULTS.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory)
      return false;
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
        <View style={styles.searchBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.searchBarArrow}
          >
            <Icon
              name="arrow-back"
              size={moderateScale(20)}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.searchBarLocation} numberOfLines={1}>
            {query || 'City, ZIP or trailer type'}
          </Text>
          <TouchableOpacity
            onPress={() => setFilterModal(true)}
            style={styles.searchBarFilter}
          >
            <Icon name="tune" size={moderateScale(20)} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFilters}
        >
          {activeFilters.map(f => (
            <View key={f} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory('All');
              setMinRating(null);
              setInstantOnly(false);
            }}
          >
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Results */}
      <Text style={styles.resultsTitle}>{filtered.length} Trailers nearby</Text>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TrailerCard
            item={item}
            onPress={() =>
              navigation.navigate('RenterTrailerDetail', { trailer: item })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search-off" size={moderateScale(48)} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No trailers found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or search area
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent>
        <View style={styles.filterModalOverlay}>
        <View style={styles.filterModalSheet}>
          {/* Header */}
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => setFilterModal(false)}
              style={styles.filterModalClose}
            >
              <Icon name="close" size={moderateScale(22)} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterDivider} />

          <ScrollView showsVerticalScrollIndicator={false} style={styles.filterModalBody}>
            {/* Trailer Category */}
            <TouchableOpacity
              style={styles.accordionRow}
              onPress={() =>
                setExpandedSection(expandedSection === 'category' ? null : 'category')
              }
            >
              <Text style={styles.accordionTitle}>Trailer Category</Text>
              <Icon
                name={expandedSection === 'category' ? 'expand-less' : 'expand-more'}
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            {expandedSection === 'category' && (
              <View style={styles.accordionContent}>
                <View style={styles.categoryChips}>
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterChip,
                        selectedCategory === cat && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setSelectedCategory(selectedCategory === cat ? 'All' : cat)
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedCategory === cat && styles.filterChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.filterDivider} />

            {/* Load Capacity */}
            <TouchableOpacity
              style={styles.accordionRow}
              onPress={() =>
                setExpandedSection(expandedSection === 'load' ? null : 'load')
              }
            >
              <Text style={styles.accordionTitle}>Load Capacity</Text>
              <Icon
                name={expandedSection === 'load' ? 'expand-less' : 'expand-more'}
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <View style={styles.filterDivider} />

            {/* Price Range */}
            <TouchableOpacity
              style={styles.accordionRow}
              onPress={() =>
                setExpandedSection(expandedSection === 'price' ? null : 'price')
              }
            >
              <Text style={styles.accordionTitle}>Price Range</Text>
              <Icon
                name={expandedSection === 'price' ? 'expand-less' : 'expand-more'}
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <View style={styles.filterDivider} />

            {/* Owner Rating */}
            <TouchableOpacity
              style={styles.accordionRow}
              onPress={() =>
                setExpandedSection(expandedSection === 'rating' ? null : 'rating')
              }
            >
              <Text style={styles.accordionTitle}>Owner Rating</Text>
              <Icon
                name={expandedSection === 'rating' ? 'expand-less' : 'expand-more'}
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            {expandedSection === 'rating' && (
              <View style={styles.accordionContent}>
                <View style={styles.ratingOptions}>
                  {[null, 3, 4, 4.5].map(r => (
                    <TouchableOpacity
                      key={String(r)}
                      style={[
                        styles.ratingChip,
                        minRating === r && styles.filterChipActive,
                      ]}
                      onPress={() => setMinRating(r)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          minRating === r && styles.filterChipTextActive,
                        ]}
                      >
                        {r === null ? 'Any' : `${r}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.filterDivider} />

            {/* Instant Book */}
            <TouchableOpacity
              style={styles.accordionRow}
              onPress={() =>
                setExpandedSection(expandedSection === 'instant' ? null : 'instant')
              }
            >
              <Text style={styles.accordionTitle}>Instant Book</Text>
              <Icon
                name={expandedSection === 'instant' ? 'expand-less' : 'expand-more'}
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            {expandedSection === 'instant' && (
              <View style={styles.accordionContent}>
                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => setInstantOnly(!instantOnly)}
                >
                  <Text style={styles.filterLabel}>Instant Book Only</Text>
                  <View style={[styles.toggle, instantOnly && styles.toggleActive]}>
                    <View
                      style={[
                        styles.toggleThumb,
                        instantOnly && styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.filterDivider} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.filterModalFooter}>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('All');
                setMinRating(null);
                setInstantOnly(false);
              }}
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterModal(false)}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortModal} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSortModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(opt.value);
                  setSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === opt.value && styles.sortOptionActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {sortBy === opt.value && (
                  <Icon
                    name="check"
                    size={moderateScale(18)}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default TrailerSearchResultsScreen;
