import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../App/Redux/Slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { openCamera, openGallery } from '../../utils/helpers/mediaPicker.helper';
import CustomFlatList from '../../Components/FlatList/CustomList';
import Icon from 'react-native-vector-icons/Feather';

/* ── component ──────────────────────────────────────────────────────────────── */
const Profile = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const menuData = [
    { id: '1', title: t('menu_rental_history') },
    { id: '2', title: t('menu_wishlist') },
    { id: '3', title: t('tab_my_trailers') },
    { id: '11', title: t('booking_requests_title') },
    { id: '19', title: t('my_bookings_owner_title') },
    { id: '20', title: t('availability_calendar_title') },
    { id: '12', title: t('menu_revenue_payouts') },
    { id: '22', title: t('my_reviews_title') },
    { id: '4', title: t('menu_support') },
    { id: '5', title: t('settings_title') },
    { id: '6', title: t('menu_about_us') },
    { id: '7', title: t('menu_terms_of_use') },
    { id: '8', title: t('privacy_policy') },
    { id: '9', title: t('menu_log_out') },
  ];

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePickProfilePhoto = () => {
    Alert.alert(t('profile_photo_title'), t('choose_option'), [
      {
        text: t('camera_option'),
        onPress: async () => {
          try {
            const file = await openCamera();
            if (file) setProfilePhoto(file);
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
      {
        text: t('gallery_option'),
        onPress: async () => {
          try {
            const file = await openGallery();
            if (file) setProfilePhoto(file);
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
      profilePhoto && {
        text: t('remove_photo'),
        style: 'destructive',
        onPress: () => setProfilePhoto(null),
      },
      { text: t('cancel_button'), style: 'cancel' },
    ].filter(Boolean));
  };

  const handleMenuPress = item => {
    if (item.id === '1') navigation.navigate('MyRentals');
    if (item.id === '2') navigation.navigate('OwnerBookings');
    if (item.id === '3') navigation.navigate('MyTrailors');
    if (item.id === '5') navigation.navigate('Settings');
    if (item.id === '10') navigation.navigate('DriverVerification');
    if (item.id === '11') navigation.navigate('BookingRequests');
    if (item.id === '12') navigation.navigate('EarningsDashboard');
    if (item.id === '17') navigation.navigate('RenterDashboard');
    if (item.id === '18') navigation.navigate('OwnerDashboard');
    if (item.id === '19') navigation.navigate('OwnerBookings');
    if (item.id === '20') navigation.navigate('AvailabilityCalendar');
    if (item.id === '21') navigation.navigate('OwnerVerification');
    if (item.id === '22') navigation.navigate('OwnerReviews');
    if (item.id === '9') dispatch(logout());
  };

  const renderHeader = () => (
    <Pressable
      style={styles.header}
      onPress={() =>
        navigation.navigate('EditProfile', {
          name: 'Anand Shaw',
          phone: '+1 99326 59658',
          accountStatus: 'active',
        })
      }>
      {/* Avatar with pencil badge */}
      <View style={styles.avatarWrapper}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto.uri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar} />
        )}
        <Pressable onPress={handlePickProfilePhoto} style={styles.pencilBadge} hitSlop={6}>
          <Icon name="edit-2" size={10} color="#fff" />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>Anand Shaw</Text>
        <Text style={styles.phone}>+1 99326 59658</Text>
      </View>

      <Icon name="chevron-right" size={20} color="#999" style={{ marginRight: 10 }} />
    </Pressable>
  );

  const isLogout = item => item.id === '9';

  const renderItem = ({ item }) => (
    <Pressable style={styles.row} onPress={() => handleMenuPress(item)}>
      <View style={styles.left}>
        <View style={styles.iconCircle} />
        <Text style={styles.rowTitle}>{item.title}</Text>
      </View>
      {!isLogout(item) && <Icon name="chevron-right" size={18} color="#999" />}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <CustomFlatList
        data={menuData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // header / profile card
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: moderateScale(12),
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D9D9D9',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pencilBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  phone: {
    fontSize: 13,
    color: '#777',
  },

  // menu rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(26),
    paddingVertical: moderateScale(6),
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D9D9D9',
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    color: '#333',
  },
});

export default Profile;
