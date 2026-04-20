import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import CustomHeader from '../../../Components/Header/CustomHeader';
// import { styles } from '../stylesheets/Notifications.styles';

/* ── Mock Data ───────────────────────────────────────────────────────────── */

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'booking_request',
    icon: 'check-circle',
    iconBg: '#1A2B6D',
    iconColor: '#fff',
    title: 'New Booking Available: 6×12 Utility Trailer',
    message: 'Marcus wants to rent your 10ft Utility Trailer for 3 days starting Mar 24',
    time: '12 Min Ago',
    actions: [
      { label: 'Accept', variant: 'primary' },
      { label: 'Decline', variant: 'outline_danger' },
    ],
  },
  {
    id: '2',
    type: 'pickup_confirmed',
    icon: 'local-shipping',
    iconBg: '#F0F0F0',
    iconColor: '#555',
    title: 'Pickup Confirmed: 6×12 Utility Trailer',
    message: "Renter 'Michael Jordan' has confirmed the pickup of your trailer. Rental ID: #123 2365.",
    time: '30 Min Ago',
    actions: [],
  },
  {
    id: '3',
    type: 'trailer_returned',
    icon: 'assignment-return',
    iconBg: '#FFF0F0',
    iconColor: '#E53935',
    title: 'Trailer Returned: 6×12 Utility Trailer',
    message: 'Your Car Hauler has been returned to the drop-off location. Please complete the inspection within 24 hours.',
    time: '3 Hrs Ago',
    actions: [],
  },
  {
    id: '4',
    type: 'booking_confirmed',
    icon: 'event-available',
    iconBg: '#EEF1FB',
    iconColor: '#1A2B6D',
    title: 'Booking Confirmed: 6×12 Utility Trailer',
    message: 'Your reservation for the premium enclosed cargo trailer has been successfully processed.',
    time: '12 Min Ago',
    actions: [
      { label: 'View Booking', variant: 'primary' },
      { label: 'Details', variant: 'ghost' },
    ],
  },
  {
    id: '5',
    type: 'reminder',
    icon: 'alarm',
    iconBg: '#F5F5F5',
    iconColor: '#555',
    title: 'Reminder: Pickup tomorrow at 9:00 AM',
    message: "Don't forget your pickup appointment at the westside Lot. Please bring a valid ID and your reservation QR code.",
    time: '30 Min Ago',
    actions: [],
  },
];

/* ── Action Button ───────────────────────────────────────────────────────── */

const ActionButton = ({ label, variant, onPress }) => {
  const isOutlineDanger = variant === 'outline_danger';
  const isGhost = variant === 'ghost';
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        isPrimary && styles.actionBtnPrimary,
        isOutlineDanger && styles.actionBtnOutlineDanger,
        isGhost && styles.actionBtnGhost,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text
        style={[
          styles.actionBtnLabel,
          isPrimary && styles.actionBtnLabelPrimary,
          isOutlineDanger && styles.actionBtnLabelDanger,
          isGhost && styles.actionBtnLabelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

/* ── Notification Card ───────────────────────────────────────────────────── */

const NotificationCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      {/* Icon */}
      <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
        <Icon name={item.icon} size={moderateScale(20)} color={item.iconColor} />
      </View>

      {/* Title + Time */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>

    {/* Message */}
    <Text style={styles.message}>{item.message}</Text>

    {/* Actions */}
    {item.actions.length > 0 && (
      <View style={styles.actionsRow}>
        {item.actions.map(action => (
          <ActionButton
            key={action.label}
            label={action.label}
            variant={action.variant}
            onPress={() => {}}
          />
        ))}
      </View>
    )}
  </View>
);

/* ── Screen ──────────────────────────────────────────────────────────────── */

const NotificationsScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safe} edges={['left', 'right']}>
    {/* Header */}
         <CustomHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        
      />
   

    <FlatList
      data={MOCK_NOTIFICATIONS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <NotificationCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </SafeAreaView>
);
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
 
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  backBtn: {
    width: moderateScale(32),
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
 
  /* ── List ── */
  listContent: {
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(32),
  },
  separator: {
    height: verticalScale(10),
  },
 
  /* ── Card ── */
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
    gap: moderateScale(10),
  },
 
  /* Icon */
  iconWrapper: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
 
  /* Title block */
  titleBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: moderateScale(4),
  },
  title: {
    flex: 1,
    fontSize: moderateScale(13.5),
    fontWeight: '700',
    color: '#111',
    lineHeight: moderateScale(19),
    paddingRight: moderateScale(6),
  },
  time: {
    fontSize: moderateScale(11),
    color: '#999',
    fontWeight: '400',
    marginTop: verticalScale(2),
  },
 
  /* Message */
  message: {
    fontSize: moderateScale(12.5),
    color: '#555',
    lineHeight: moderateScale(18),
    marginTop: verticalScale(2),
  },
 
  /* ── Actions ── */
  actionsRow: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginTop: verticalScale(12),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  /* Primary */
  actionBtnPrimary: {
    backgroundColor: '#1A2B6D',
  },
  actionBtnLabelPrimary: {
    color: '#fff',
    fontWeight: '700',
  },
 
  /* Outline Danger */
  actionBtnOutlineDanger: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5,
    borderColor: '#E53935',
  },
  actionBtnLabelDanger: {
    color: '#E53935',
    fontWeight: '600',
  },
 
  /* Ghost */
  actionBtnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
  },
  actionBtnLabelGhost: {
    color: '#1A2B6D',
    fontWeight: '600',
  },
 
  /* shared label base */
  actionBtnLabel: {
    fontSize: moderateScale(13.5),
  },
});
export default NotificationsScreen;