import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';
import { useColors } from '../../Theme/ThemeContext';
import {styles} from "./AvailabilityCalender.style"
const today = new Date().toISOString().split('T')[0];

const MOCK_TRAILERS = [
  { id: '1', name: 'Heavy Duty Flatbed' },
  { id: '2', name: 'Enclosed Cargo 7x14' },
  { id: '3', name: 'Dump Trailer 14ft' },
];

const AvailabilityCalendarScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  

  // Pre-marked: booked dates (blue) and blocked dates (red)
  const INITIAL_MARKED = useMemo(
    () => ({
      '2025-03-22': {
        selected: true,
        color: colors.primary,
        textColor: '#fff',
        marked: true,
        dotColor: colors.primary,
      },
      '2025-03-23': {
        selected: true,
        color: colors.primary,
        textColor: '#fff',
      },
      '2025-03-24': {
        selected: true,
        color: colors.primary,
        textColor: '#fff',
      },
      '2025-03-28': { selected: true, color: '#E53935', textColor: '#fff' },
      '2025-03-29': { selected: true, color: '#E53935', textColor: '#fff' },
    }),
    [colors.primary],
  );

  const [selectedTrailer, setSelectedTrailer] = useState(MOCK_TRAILERS[0]);
  const [markedDates, setMarkedDates] = useState(INITIAL_MARKED);
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockModal, setBlockModal] = useState(false);
  const [selectingBlock, setSelectingBlock] = useState('start');
  const [minDays, setMinDays] = useState('1');
  const [maxDays, setMaxDays] = useState('30');
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [trailerModal, setTrailerModal] = useState(false);

  const handleDayPress = day => {
    if (!blockModal) return;
    if (selectingBlock === 'start') {
      setBlockStart(day.dateString);
      setBlockEnd('');
      setSelectingBlock('end');
    } else {
      if (day.dateString <= blockStart) {
        setBlockStart(day.dateString);
        setBlockEnd('');
        setSelectingBlock('end');
      } else {
        setBlockEnd(day.dateString);
        setSelectingBlock('start');
      }
    }
  };

  const applyBlock = () => {
    if (!blockStart || !blockEnd) {
      Alert.alert(
        'Select dates',
        'Please select both start and end dates to block.',
      );
      return;
    }
    const updated = { ...markedDates };
    let cur = new Date(blockStart);
    const end = new Date(blockEnd);
    while (cur <= end) {
      const k = cur.toISOString().split('T')[0];
      updated[k] = { selected: true, color: '#E53935', textColor: '#fff' };
      cur.setDate(cur.getDate() + 1);
    }
    setMarkedDates(updated);
    setBlockModal(false);
    setBlockStart('');
    setBlockEnd('');
    Alert.alert(
      t('dates_blocked'),
      t('dates_blocked_message', { start: blockStart, end: blockEnd }),
    );
  };

  const clearBlock = () => {
    Alert.alert(t('clear_blocks_title'), t('clear_blocks_message'), [
      { text: t('cancel_button'), style: 'cancel' },
      {
        text: t('clear_button'),
        style: 'destructive',
        onPress: () => {
          const updated = {};
          Object.entries(markedDates).forEach(([k, v]) => {
            if (v.color === colors.primary) updated[k] = v; // keep booked dates
          });
          setMarkedDates(updated);
        },
      },
    ]);
  };

  const blockMarked = {};
  if (blockStart)
    blockMarked[blockStart] = {
      selected: true,
      startingDay: true,
      color: '#E53935',
    };
  if (blockEnd)
    blockMarked[blockEnd] = {
      selected: true,
      endingDay: true,
      color: '#E53935',
    };
  if (blockStart && blockEnd) {
    let cur = new Date(blockStart);
    cur.setDate(cur.getDate() + 1);
    const end = new Date(blockEnd);
    while (cur < end) {
      const k = cur.toISOString().split('T')[0];
      blockMarked[k] = {
        selected: true,
        color: '#FECACA',
        textColor: '#E53935',
      };
      cur.setDate(cur.getDate() + 1);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <CustomIconButton
          onPress={() => navigation.goBack()}
          icon={
            <Icon
              name="arrow-back"
              size={moderateScale(22)}
              color={colors.textPrimary}
            />
          }
          style={styles.backBtn}
        />

        <Text style={styles.headerTitle}>
          {t('availability_calendar_title')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Trailer Selector */}
        <CustomButton
          onPress={() => setTrailerModal(true)}
          leftIcon={
            <Icon
              name="local-shipping"
              size={moderateScale(18)}
              color={colors.primary}
            />
          }
          rightIcon={
            <Icon
              name="expand-more"
              size={moderateScale(20)}
              color={colors.textSecondary}
            />
          }
          title={selectedTrailer.name}
          variant="outline"
          style={styles.trailerSelector}
          textStyle={styles.trailerSelectorText}
        />

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.primary }]}
            />
            <Text style={styles.legendText}>{t('booked_legend')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
            <Text style={styles.legendText}>{t('blocked_legend')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.success }]}
            />
            <Text style={styles.legendText}>{t('available_legend')}</Text>
          </View>
        </View>

        {/* Calendar */}
        <Calendar
          onDayPress={handleDayPress}
          markingType="period"
          markedDates={markedDates}
          minDate={today}
          theme={{
            selectedDayBackgroundColor: colors.primary,
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
            calendarBackground: '#fff',
          }}
          style={styles.calendar}
        />

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.blockBtn}
            onPress={() => setBlockModal(true)}
          >
            <Icon name="block" size={moderateScale(16)} color={colors.error} />
            <Text style={styles.blockBtnText}>{t('block_dates_button')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearBlock}>
            <Icon
              name="delete-outline"
              size={moderateScale(16)}
              color={colors.textSecondary}
            />
            <Text style={styles.clearBtnText}>{t('clear_blocks_button')}</Text>
          </TouchableOpacity>
        </View>

        {/* Rental Rules */}
        <Text style={styles.sectionTitle}>
          {t('rental_duration_rules_section')}
        </Text>
        <View style={styles.rulesCard}>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleLabel}>{t('minimum_rental_days')}</Text>
            <View style={styles.ruleCounter}>
              <TouchableOpacity
                onPress={() =>
                  setMinDays(v => String(Math.max(1, Number(v) - 1)))
                }
              >
                <Icon
                  name="remove-circle-outline"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.ruleValue}>{minDays}</Text>
              <TouchableOpacity
                onPress={() => setMinDays(v => String(Number(v) + 1))}
              >
                <Icon
                  name="add-circle-outline"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.ruleRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.ruleLabel}>{t('maximum_rental_days')}</Text>
            <View style={styles.ruleCounter}>
              <TouchableOpacity
                onPress={() =>
                  setMaxDays(v => String(Math.max(1, Number(v) - 1)))
                }
              >
                <Icon
                  name="remove-circle-outline"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.ruleValue}>{maxDays}</Text>
              <TouchableOpacity
                onPress={() => setMaxDays(v => String(Number(v) + 1))}
              >
                <Icon
                  name="add-circle-outline"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recurring Availability */}
        <View style={styles.recurringCard}>
          <View style={styles.recurringRow}>
            <View>
              <Text style={styles.recurringTitle}>
                {t('recurring_availability_label')}
              </Text>
              <Text style={styles.recurringSubtitle}>
                {t('recurring_availability_desc')}
              </Text>
            </View>
            <Switch
              value={recurringEnabled}
              onValueChange={setRecurringEnabled}
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={recurringEnabled ? colors.primary : '#9CA3AF'}
            />
          </View>
          {recurringEnabled && (
            <Text style={styles.recurringNote}>
              {t('recurring_availability_note')}
            </Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() =>
            Alert.alert(t('dates_blocked'), 'Availability settings updated.')
          }
        >
          <Icon name="save" size={moderateScale(18)} color="#fff" />
          <Text style={styles.saveBtnText}>
            {t('save_availability_button')}
          </Text>
        </TouchableOpacity>

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>

      {/* Block Modal */}
      <Modal visible={blockModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('block_dates_title')}</Text>
            <Text style={styles.modalSubtitle}>
              {selectingBlock === 'start'
                ? t('select_start_date')
                : t('select_end_date')}
            </Text>
            <View style={styles.dateDisplay}>
              <View style={styles.dateBox}>
                <Text style={styles.dateBoxLabel}>{t('from_label')}</Text>
                <Text style={styles.dateBoxValue}>{blockStart || '—'}</Text>
              </View>
              <Icon
                name="arrow-forward"
                size={moderateScale(18)}
                color={colors.textSecondary}
              />
              <View style={styles.dateBox}>
                <Text style={styles.dateBoxLabel}>{t('to_label')}</Text>
                <Text style={styles.dateBoxValue}>{blockEnd || '—'}</Text>
              </View>
            </View>
            <Calendar
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={blockMarked}
              minDate={today}
              theme={{
                selectedDayBackgroundColor: '#E53935',
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
              }}
            />
            <TouchableOpacity
              style={[
                styles.applyBtn,
                (!blockStart || !blockEnd) && { opacity: 0.5 },
              ]}
              onPress={applyBlock}
            >
              <Text style={styles.applyBtnText}>{t('apply_block_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelLink}
              onPress={() => {
                setBlockModal(false);
                setBlockStart('');
                setBlockEnd('');
              }}
            >
              <Text style={styles.cancelLinkText}>{t('cancel_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Trailer Picker Modal */}
      <Modal visible={trailerModal} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setTrailerModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('select_trailer_title')}</Text>
            {MOCK_TRAILERS.map(tr => (
              <TouchableOpacity
                key={tr.id}
                style={styles.trailerOption}
                onPress={() => {
                  setSelectedTrailer(tr);
                  setTrailerModal(false);
                }}
              >
                <Text
                  style={[
                    styles.trailerOptionText,
                    selectedTrailer.id === tr.id && {
                      color: colors.primary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {tr.name}
                </Text>
                {selectedTrailer.id === tr.id && (
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



export default AvailabilityCalendarScreen;
