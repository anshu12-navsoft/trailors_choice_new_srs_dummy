import React, { useState, useMemo, useEffect, memo } from 'react';
import { View, StyleSheet, Modal, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarList } from 'react-native-calendars';
import { Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import CustomIconButton from '../Buttons/CustomIconButton';
import CustomButton from '../Buttons/CustomButton';
import CustomLoader from '../Loader/CustomLoader';

/* ── Constants ───────────────────────────────────────────────────────────── */

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const today = new Date().toISOString().split('T')[0];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const buildMarkedDates = (start, end) => {
  if (!start) return {};

  const marks = {};
  marks[start] = { startingDay: true, color: '#000', textColor: '#fff' };

  if (!end) return marks;

  let current = new Date(start);
  current.setDate(current.getDate() + 1);
  const last = new Date(end);

  while (current < last) {
    const key = current.toISOString().split('T')[0];
    marks[key] = { color: '#E5E5E5', textColor: '#000' };
    current.setDate(current.getDate() + 1);
  }

  marks[end] = { endingDay: true, color: '#000', textColor: '#fff' };
  return marks;
};

/* ── Component ───────────────────────────────────────────────────────────── */

/**
 * CustomCalender
 *
 * Props:
 *   visible      — controls Modal visibility
 *   startDate    — selected start date (YYYY-MM-DD)
 *   endDate      — selected end date (YYYY-MM-DD)
 *   onChange     — ({ startDate, endDate }) => void  — called on Save
 *   onClose      — called when modal is dismissed
 *   readOnly     — if true, dates cannot be changed (view only)
 *   minDate      — minimum selectable date
 */
const CustomCalender = memo(({
  visible,
  startDate,
  endDate,
  onChange,
  onClose,
  readOnly = false,
  minDate = today,
}) => {
  const { height } = useWindowDimensions();
  const { colors } = useTheme();

  const [tab, setTab] = useState('dates');
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const [calendarReady, setCalendarReady] = useState(false);

  // Sync local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalStart(startDate);
      setLocalEnd(endDate);
      setCalendarReady(false);
    }
  }, [visible]);

  const handleDayPress = day => {
    if (readOnly) return;
    const selected = day.dateString;

    if (!localStart || (localStart && localEnd)) {
      setLocalStart(selected);
      setLocalEnd(null);
    } else {
      if (selected <= localStart) {
        setLocalStart(selected);
        setLocalEnd(null);
      } else {
        setLocalEnd(selected);
      }
    }
  };

  const handleSave = () => {
    onChange?.({ startDate: localStart, endDate: localEnd });
    onClose?.();
  };

  const handleReset = () => {
    setLocalStart(null);
    setLocalEnd(null);
  };

  const markedDates = useMemo(() => buildMarkedDates(localStart, localEnd), [localStart, localEnd]);
  const calendarHeight = useMemo(() => height * 0.42, [height]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Close */}
        <View style={styles.closeRow}>
          <CustomIconButton icon="close" variant="ghost" onPress={onClose} />
        </View>

        {/* Dates | Month toggle */}
        <View style={styles.toggleWrapper}>
          <SegmentedButtons
            value={tab}
            onValueChange={setTab}
            buttons={[
              { value: 'dates', label: 'Dates' },
              { value: 'month', label: 'Month' },
            ]}
            style={styles.segmented}
          />
        </View>

        {/* Day headers — shown once at top */}
        <View style={[styles.dayHeaders, { borderColor: colors.outline }]}>
          {DAY_NAMES.map((d, i) => (
            <Text key={i} style={[styles.dayHeaderText, { color: colors.onSurfaceVariant }]}>
              {d}
            </Text>
          ))}
        </View>

        {/* CalendarList — 2 months visible, scrollable */}
        <View style={styles.calendarContainer}>
          {!calendarReady && <CustomLoader label="Loading calendar..." />}
          <CalendarList
            minDate={minDate}
            pastScrollRange={0}
            futureScrollRange={12}
            calendarHeight={calendarHeight}
            markingType="period"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            hideArrows
            hideDayNames
            showScrollIndicator={false}
            onLayout={() => setCalendarReady(true)}
            style={!calendarReady ? { opacity: 0, position: 'absolute' } : undefined}
            theme={{
              calendarBackground: colors.background,
              monthTextColor: colors.onBackground,
              textMonthFontSize: moderateScale(15),
              textMonthFontWeight: '700',
              todayTextColor: colors.primary,
              dayTextColor: colors.onSurface,
              textDisabledColor: colors.onSurfaceDisabled,
              textDayFontSize: moderateScale(14),
            }}
          />
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderColor: colors.outline }]}>
          {readOnly ? (
            <CustomButton title="Close" onPress={onClose} variant="outline" size="medium" style={{ flex: 1 }} />
          ) : (
            <>
              <Pressable onPress={handleReset} style={styles.resetBtn}>
                <Text variant="titleSmall" style={{ fontWeight: '600', color: colors.onSurface }}>
                  Reset
                </Text>
              </Pressable>
              <CustomButton
                title="Save"
                onPress={handleSave}
                variant="primary"
                size="medium"
                style={styles.saveBtn}
              />
            </>
          )}
        </View>

      </SafeAreaView>
    </Modal>
  );
});

export default CustomCalender;

/* ── Styles ──────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  closeRow: {
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(4),
  },
  toggleWrapper: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(12),
  },
  segmented: {
    borderRadius: moderateScale(30),
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(6),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayHeaderText: {
    width: 32,
    textAlign: 'center',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(16),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  resetBtn: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
  },
  saveBtn: {
    borderRadius: moderateScale(8),
    backgroundColor: '#000',
    minWidth: moderateScale(120),
  },
});
