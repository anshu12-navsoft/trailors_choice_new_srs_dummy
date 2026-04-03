import React, { useState } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../App/Redux/Slices/trailerSlice';
import CustomSearchInput from '../../Components/TextInput/CustomSearchInput';
import CustomIconButton from '../../Components/Buttons/CustomIconButton';
import CustomButton from '../../Components/Buttons/CustomButton';
import CustomCards from '../../Components/Card/CustomCards';
import {styles} from "./Home.style"
/* ── Mock data ───────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: '1', label: 'Utility' },
  { id: '2', label: 'Car Hauler' },
  { id: '3', label: 'Enclosed' },
  { id: '4', label: 'Flatbed' },
  { id: '5', label: 'Dump' },
  { id: '6', label: 'Boat' },
  { id: '7', label: 'Gooseneck' },
  { id: '8', label: 'Horse' },
  { id: '9', label: 'Livestock' },
];

const MOCK_TRAILERS = [
  {
    id: '1',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '2',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '3',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '4',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
   {
    id: '5',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '6',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '7',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
  {
    id: '8',
    title: 'Tandem Axel',
    distance: '2.4 miles',
    address: 'E 8th St.',
    dims: "5'x3', 2000 lbs",
    priceDay: 50,
    priceWeek: 150,
  },
];

/* ── Sub-components ──────────────────────────────────────────────────────── */

const CategoryItem = ({ label }) => (
  <View style={styles.categoryItem}>
    <View style={styles.categoryImage}>
      <Icon name="image" size={moderateScale(28)} color="#C0C0C0" />
    </View>
    <Text variant="labelSmall" style={styles.categoryLabel}>
      {label}
    </Text>
  </View>
);

const TrailerCard = ({ item, onPress }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const imageSize = (width - moderateScale(12) * 2 - moderateScale(8)) / 2;

  return (
    <CustomCards
      variant="flat"
      onPress={onPress}
      style={styles.trailerCard}
      contentStyle={{ padding: 0 }}
    >
      {/* Image */}
      <View
        style={[
          styles.trailerImage,
          { width: imageSize, height: imageSize * 0.8 },
        ]}
      >
        <Icon name="image" size={moderateScale(32)} color="#C0C0C0" />
      </View>

      {/* Caption */}
      <View style={styles.caption}>
        <Text variant="titleSmall" style={styles.trailerTitle}>
          {item.title}
        </Text>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          {item.distance} - {item.address}
        </Text>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          {item.dims}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="labelMedium">
            <Text style={styles.priceBold}>${item.priceDay}</Text>
            <Text style={{ color: colors.onSurfaceVariant }}>/day</Text>
          </Text>
          <Text variant="labelMedium">
            <Text style={styles.priceBold}>${item.priceWeek}</Text>
            <Text style={{ color: colors.onSurfaceVariant }}>/week</Text>
          </Text>
        </View>
      </View>
    </CustomCards>
  );
};

/* ── Screen ──────────────────────────────────────────────────────────────── */

const Home = ({ navigation }) => {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.trailer.favorites);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.toggleDrawer()} style={styles.logoWrapper}>
            <Text style={styles.logoT}>T</Text>
            <Text style={styles.logoC}>C</Text>
          </Pressable>

          <CustomIconButton
            icon="account-circle"
            variant="ghost"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        {/* ── Search bar ── */}
        <CustomSearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by location and date"
          onClear={() => setSearch('')}
          onFocus={() => navigation.navigate('SearchFilter')}
          style={styles.searchBar}
        />

        {/* ── Categories ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map(cat => (
            <CategoryItem key={cat.id} label={cat.label} />
          ))}
        </ScrollView>

        {/* ── Trailers Near You ── */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={{ fontWeight: '700' }}>
            Trailers Near You
          </Text>
          <CustomButton
            variant="text"
            size="small"
            title="View All"
            onPress={() => navigation.navigate('TrailerSearchResults', {})}
            rightIcon={
              <Icon
                name="chevron-right"
                size={moderateScale(16)}
                color={colors.primary}
              />
            }
          />
        </View>

        <FlatList
          data={MOCK_TRAILERS}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <TrailerCard
              item={item}
              onPress={() =>
                navigation.navigate('RenterTrailerDetail', { trailer: item })
              }
              isFavorite={favorites?.includes(item.id)}
              onFavorite={() => dispatch(toggleFavorite(item.id))}
            />
          )}
        />

        <View style={{ height: verticalScale(20) }} />
      </ScrollView>
    </SafeAreaView>
  );
};



export default Home;
