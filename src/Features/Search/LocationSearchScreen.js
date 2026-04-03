import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomIconButton from '../../Components/Buttons/CustomIconButton';
import CustomSearchInput from '../../Components/TextInput/CustomSearchInput';
import { styles } from './LocationSearch.style';
/* ── Static nearby suggestions ─────────────────────────────────────────── */
const NEARBY_SUGGESTIONS = [
  { id: 'dallas', title: 'Dallas', subtitle: 'Texas, United States' },
  { id: 'texas', title: 'Texas', subtitle: 'United States' },
  { id: 'houston', title: 'Houston', subtitle: 'Texas, United States' },
  { id: 'austin', title: 'Austin', subtitle: 'Texas, United States' },
  { id: 'sanant', title: 'San Antonio', subtitle: 'Texas, United States' },
];

/* ── Row ────────────────────────────────────────────────────────────────── */
const SuggestionRow = ({ icon, title, subtitle, onPress, colors }) => (
  <Pressable
    style={styles.row}
    onPress={onPress}
    android_ripple={{ color: colors.surfaceVariant }}
  >
    <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
      <Icon
        name={icon}
        size={moderateScale(20)}
        color={colors.onSurfaceVariant}
      />
    </View>
    <View style={styles.rowText}>
      <Text
        variant="bodyMedium"
        style={{ color: colors.onSurface }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="bodySmall"
          style={{ color: colors.onSurfaceVariant }}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  </Pressable>
);

/* ── Screen ─────────────────────────────────────────────────────────────── */
const LocationSearchScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? NEARBY_SUGGESTIONS.filter(
        s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(query.toLowerCase()),
      )
    : NEARBY_SUGGESTIONS;

  const selectPlace = title => {
    navigation.navigate('SearchFilter', { selectedLocation: title });
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <CustomIconButton
          icon="close"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <CustomSearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search destination"
          autoFocus
        />
      </View>

      {/* List */}
      <FlatList
        data={[{ id: '__current__', isCurrent: true }, ...filtered]}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.separator,
              { backgroundColor: colors.outlineVariant },
            ]}
          />
        )}
        renderItem={({ item }) => {
          if (item.isCurrent) {
            return (
              <SuggestionRow
                icon="crosshairs-gps"
                title="Current location"
                subtitle="Use your device location"
                onPress={() => selectPlace('Current location')}
                colors={colors}
              />
            );
          }
          return (
            <SuggestionRow
              icon="map-marker-outline"
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => selectPlace(item.title)}
              colors={colors}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default LocationSearchScreen;

/* ── Styles ─────────────────────────────────────────────────────────────── */
