import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import CustomCalender from '../../../Components/Calender/CustomCalender';
import CustomDropdown from '../../../Components/Dropdown/CustomDropdown';
import CustomButton from '../../../Components/Buttons/CustomButton';
import CustomIconButton from '../../../Components/Buttons/CustomIconButton';
import CustomSearchInput from '../../../Components/TextInput/CustomSearchInput';
import { styles } from '../stylesheets/SearchFilter.style';
/* ── Time options ────────────────────────────────────────────────────────── */

const generateTimes = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? 'AM' : 'PM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      const min = String(m).padStart(2, '0');
      options.push({
        label: `${hour}:${min} ${period}`,
        value: `${String(h).padStart(2, '0')}:${min}`,
      });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimes();

const formatDisplay = date =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Select date';

/* ── Date Trigger ────────────────────────────────────────────────────────── */

const DateTrigger = ({ label, value, onPress }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.triggerWrapper}>
      <Text
        variant="labelMedium"
        style={[styles.fieldLabel, { color: colors.onSurface }]}
      >
        {label}
      </Text>
      <Pressable
        style={[styles.trigger, { borderColor: colors.outline }]}
        onPress={onPress}
      >
        <Text
          variant="bodyMedium"
          style={{
            flex: 1,
            color: value ? colors.onSurface : colors.onSurfaceDisabled,
          }}
        >
          {formatDisplay(value)}
        </Text>
        <Text style={{ color: colors.onSurfaceVariant }}>⌄</Text>
      </Pressable>
    </View>
  );
};

/* ── Screen ──────────────────────────────────────────────────────────────── */

const SearchFilterScreen = ({ navigation, route }) => {
  const { colors } = useTheme();

  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState(null);

  // Receive selected location back from LocationSearchScreen
  useEffect(() => {
    if (route.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);
  const [untilDate, setUntilDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [untilTime, setUntilTime] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarReadOnly, setCalendarReadOnly] = useState(false);

  const handleDateChange = ({ startDate: s, endDate: e }) => {
    setFromDate(s ?? null);
    setUntilDate(e ?? null);
  };

  const handleSearch = () => {
    navigation.navigate('TrailerSearchResults', {
      location,
      fromDate,
      untilDate,
      fromTime,
      untilTime,
    });
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Close */}
      <View style={styles.closeRow}>
        <CustomIconButton
          icon="close"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Location */}
        <View>
          <Text
            variant="labelLarge"
            style={[styles.fieldLabel, { color: colors.onSurface }]}
          >
            Location
          </Text>
          <CustomSearchInput
            value={location}
            onChangeText={setLocation}
            placeholder="Enter city, address or zip"
            onFocus={() => navigation.navigate('LocationSearch')}
          />
        </View>

        {/* From row */}
        <View style={styles.row}>
          <DateTrigger
            label="From"
            value={fromDate}
            onPress={() => {
              setCalendarReadOnly(false);
              setCalendarVisible(true);
            }}
          />
          <CustomDropdown
            label="Time"
            value={fromTime}
            options={TIME_OPTIONS}
            onSelect={setFromTime}
            placeholder="Time"
            style={styles.halfField}
          />
        </View>

        {/* Until row */}
        <View style={styles.row}>
          <DateTrigger
            label="Until"
            value={untilDate}
            onPress={() => {
              setCalendarReadOnly(true);
              setCalendarVisible(true);
            }}
          />
          <CustomDropdown
            label="Time"
            value={untilTime}
            options={TIME_OPTIONS}
            onSelect={setUntilTime}
            placeholder="Time"
            style={styles.halfField}
          />
        </View>
      </ScrollView>

      {/* Search button */}
      <View style={styles.footer}>
        <CustomButton
          title="Search"
          onPress={handleSearch}
          variant="primary"
          size="large"
          style={styles.searchBtn}
        />
      </View>

      <CustomCalender
        visible={calendarVisible}
        startDate={fromDate}
        endDate={untilDate}
        onChange={handleDateChange}
        onClose={() => setCalendarVisible(false)}
        readOnly={calendarReadOnly}
      />
    </SafeAreaView>
  );
};

export default SearchFilterScreen;
