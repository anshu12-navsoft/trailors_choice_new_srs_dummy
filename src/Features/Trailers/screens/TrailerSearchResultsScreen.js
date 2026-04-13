import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../Constants/Colors';
import { styles } from '../stylesheets/TrailorSearchResult.style';
import CustomButton from '../../../Components/Buttons/CustomButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_PEEK = SCREEN_HEIGHT * 0.15;
const SNAP_HALF = SCREEN_HEIGHT * 0.5;
const SNAP_FULL = SCREEN_HEIGHT * 0.7;
const SNAP_POINTS = [SNAP_PEEK, SNAP_HALF, SNAP_FULL];

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
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '2',
    title: 'Tandem Axel',
    category: 'Enclosed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: false,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '3',
    title: 'Tandem Axel',
    category: 'Flatbed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '4',
    title: 'Tandem Axel',
    category: 'Car Hauler',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '5',
    title: 'Tandem Axel',
    category: 'Dump',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: false,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '6',
    title: 'Tandem Axel',
    category: 'Boat',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '7',
    title: 'Tandem Axel',
    category: 'RV',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: false,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '8',
    title: 'Tandem Axel',
    category: 'Utility',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '9',
    title: 'Tandem Axel',
    category: 'Flatbed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: false,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
  {
    id: '10',
    title: 'Tandem Axel',
    category: 'Enclosed',
    rating: 4.5,
    reviewCount: 55,
    distance: 2.4,
    street: 'E 8th St.',
    specs: "5'x3', 2000 lbs",
    pricePerDay: 50,
    pricePerWeek: 150,
    instantBook: true,
    trailorTitle: '5*3 Tandem Axel',
    distanceCapacity: '500 miles away',
  },
];

const TrailerCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.cardImage}>
      <Icon name="image" size={moderateScale(32)} color="#C4C4C4" />
    </View>
    <View style={styles.cardInfo}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={moderateScale(13)} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {' '}
            {item.rating} ({item.reviewCount})
          </Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>
        {item.distance} miles away · {item.street}
      </Text>
      <Text style={styles.cardSpecs}>{item.specs}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          <Text style={styles.priceBold}>${item.pricePerDay}</Text>
          <Text style={styles.perDay}>/day</Text>
        </Text>
        <Text style={styles.priceWeek}>
          <Text style={styles.priceWeekBold}>${item.pricePerWeek}</Text>
          <Text style={styles.perDay}>/week</Text>
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const TrailerSearchResultsScreen = ({ navigation, route }) => {
  const initialQuery = route.params?.query ?? '';
  const [query] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterModal, setFilterModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(null);
  const [instantOnly, setInstantOnly] = useState(false);
  const [expandedSection, setExpandedSection] = useState('category');
  const [currentSnap, setCurrentSnap] = useState('half');

  const sheetHeight = useRef(new Animated.Value(SNAP_HALF)).current;
  const lastHeight = useRef(SNAP_HALF);

  const snapTo = useCallback(
    targetHeight => {
      lastHeight.current = targetHeight;
      if (targetHeight >= SNAP_FULL - 10) setCurrentSnap('full');
      else if (targetHeight >= SNAP_HALF - 10) setCurrentSnap('half');
      else setCurrentSnap('peek');

      Animated.spring(sheetHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
        tension: 50,
        friction: 9,
      }).start();
    },
    [sheetHeight],
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 5,
      onPanResponderGrant: () => {
        sheetHeight.stopAnimation(value => {
          lastHeight.current = value;
        });
      },
      onPanResponderMove: (_, { dy }) => {
        const newH = Math.max(
          SNAP_PEEK,
          Math.min(SNAP_FULL, lastHeight.current - dy),
        );
        sheetHeight.setValue(newH);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const currentH = Math.max(
          SNAP_PEEK,
          Math.min(SNAP_FULL, lastHeight.current - dy),
        );
        let target;
        if (Math.abs(vy) > 0.5) {
          // Velocity-based snap
          if (vy < 0) {
            // Flicking up → expand
            target = currentH > SNAP_HALF ? SNAP_FULL : SNAP_HALF;
          } else {
            // Flicking down → collapse
            target = currentH < SNAP_HALF ? SNAP_PEEK : SNAP_HALF;
          }
        } else {
          // Nearest snap point
          target = SNAP_POINTS.reduce((prev, curr) =>
            Math.abs(curr - currentH) < Math.abs(prev - currentH) ? curr : prev,
          );
        }
        // Update lastHeight before snapTo adjusts it
        lastHeight.current = currentH;
        snapTo(target);
      },
    }),
  ).current;

  const toggleExpand = () => {
    if (currentSnap === 'full') {
      snapTo(SNAP_HALF);
    } else {
      snapTo(SNAP_FULL);
    }
  };

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
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ── Map Placeholder (full background) ── */}
      <View style={styles.mapContainer}>
        <Icon name="map" size={moderateScale(64)} color="#B0BEC5" />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.mapPlaceholderSub}>
          Map integration coming soon
        </Text>
      </View>

      {/* ── Floating Header over map ── */}
      <SafeAreaView style={styles.floatingSafeArea} edges={['top']}>
        <View style={styles.floatingHeader}>
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
              <Icon
                name="tune"
                size={moderateScale(20)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Bottom Sheet ── */}
      <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
        {/* Drag handle area */}
        <View style={styles.sheetHandleArea} {...panResponder.panHandlers}>
          <CustomButton style={styles.sheetHandleBar} onPress={toggleExpand} />

          <View style={styles.sheetTopRow}>
            <Text style={styles.resultsTitle}>
              {filtered.length} Trailers nearby
            </Text>
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

        {/* Trailer list */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
              <Icon
                name="search-off"
                size={moderateScale(48)}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No trailers found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or search area
              </Text>
            </View>
          }
        />
      </Animated.View>

      {/* ── Filter Modal ── */}
      <Modal visible={filterModal} animationType="slide" transparent>
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalSheet}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filters</Text>
              <TouchableOpacity
                onPress={() => setFilterModal(false)}
                style={styles.filterModalClose}
              >
                <Icon
                  name="close"
                  size={moderateScale(22)}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.filterDivider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.filterModalBody}
            >
              {/* Trailer Category */}
              <TouchableOpacity
                style={styles.accordionRow}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'category' ? null : 'category',
                  )
                }
              >
                <Text style={styles.accordionTitle}>Trailer Category</Text>
                <Icon
                  name={
                    expandedSection === 'category'
                      ? 'expand-less'
                      : 'expand-more'
                  }
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
                          setSelectedCategory(
                            selectedCategory === cat ? 'All' : cat,
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedCategory === cat &&
                              styles.filterChipTextActive,
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
                  name={
                    expandedSection === 'load' ? 'expand-less' : 'expand-more'
                  }
                  size={moderateScale(22)}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <View style={styles.filterDivider} />

              {/* Price Range */}
              <TouchableOpacity
                style={styles.accordionRow}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'price' ? null : 'price',
                  )
                }
              >
                <Text style={styles.accordionTitle}>Price Range</Text>
                <Icon
                  name={
                    expandedSection === 'price' ? 'expand-less' : 'expand-more'
                  }
                  size={moderateScale(22)}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <View style={styles.filterDivider} />

              {/* Owner Rating */}
              <TouchableOpacity
                style={styles.accordionRow}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'rating' ? null : 'rating',
                  )
                }
              >
                <Text style={styles.accordionTitle}>Owner Rating</Text>
                <Icon
                  name={
                    expandedSection === 'rating' ? 'expand-less' : 'expand-more'
                  }
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
                  setExpandedSection(
                    expandedSection === 'instant' ? null : 'instant',
                  )
                }
              >
                <Text style={styles.accordionTitle}>Instant Book</Text>
                <Icon
                  name={
                    expandedSection === 'instant'
                      ? 'expand-less'
                      : 'expand-more'
                  }
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
                    <View
                      style={[
                        styles.toggle,
                        instantOnly && styles.toggleActive,
                      ]}
                    >
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

      {/* ── Sort Modal ── */}
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
    </View>
  );
};

export default TrailerSearchResultsScreen;
