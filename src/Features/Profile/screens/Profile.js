import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, Image, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../../App/Redux/Slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  openCamera,
  openGallery,
} from '../../../utils/helpers/mediaPicker.helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../stylesheets/Profile.style';
import CustomHeader from '../../../Components/Header/CustomHeader';
const Profile = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [profilePhoto, setProfilePhoto] = useState(null);

  const group1 = [
    {
      id: '1',
      title: t('menu_rental_history'),
      icon: 'calendar-month-outline',
    },
    { id: '2', title: t('menu_wishlist'), icon: 'heart-outline' },
    { id: '3', title: t('tab_my_trailers'), icon: 'truck-outline' },
  ];

  const group2 = [
    { id: '4', title: t('menu_support'), icon: 'lifebuoy' },
    { id: '5', title: t('settings_title'), icon: 'cog-outline' },
    { id: '6', title: t('menu_about_us'), icon: 'information-outline' },
    { id: '7', title: t('menu_terms_of_use'), icon: 'file-document-outline' },
    { id: '8', title: t('privacy_policy'), icon: 'shield-check-outline' },
  ];

  const handlePickProfilePhoto = () => {
    Alert.alert(
      t('profile_photo_title'),
      t('choose_option'),
      [
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
      ].filter(Boolean),
    );
  };

  const handleMenuPress = id => {
    if (id === '1') navigation.navigate('MyRentals');
    if (id === '2') navigation.navigate('OwnerBookings');
    if (id === '3') navigation.navigate('MyTrailors');
    if (id === '5') navigation.navigate('Settings');
    if (id === '22') navigation.navigate('OwnerReviews');
  };

  const renderMenuItem = item => (
    <Pressable
      key={item.id}
      style={styles.row}
      onPress={() => handleMenuPress(item.id)}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Icon name={item.icon} size={20} color="#2563EB" />
        </View>
        <Text style={styles.rowTitle}>{item.title}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#9CA3AF" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <CustomHeader title={t('Profile')} onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Profile header */}
        <Pressable
          style={styles.profileSection}
          onPress={() =>
            navigation.navigate('EditProfile', {
              name: 'Anand Shaw',
              phone: '+1 99326 59658',
              accountStatus: 'active',
            })
          }
        >
          <View style={styles.avatarWrapper}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto.uri }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar} />
            )}
            <Pressable
              onPress={handlePickProfilePhoto}
              style={styles.pencilBadge}
              hitSlop={6}
            >
              <Icon name="pencil" size={10} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.name}>Anand Shaw</Text>
          <Text style={styles.memberSince}>Member since March 2026</Text>
        </Pressable>

        <View style={styles.divider} />

        {/* Group 1 */}
        <View style={styles.menuGroup}>{group1.map(renderMenuItem)}</View>

        <View style={styles.divider} />

        {/* Group 2 */}
        <View style={styles.menuGroup}>{group2.map(renderMenuItem)}</View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Icon name="logout" size={18} color="#E53935" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
