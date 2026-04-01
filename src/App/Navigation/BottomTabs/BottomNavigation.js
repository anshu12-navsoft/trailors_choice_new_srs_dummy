import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import {
  HomeStack,
  MyRentalsStack,
  MyTrailorsStack,
  ProfileStack,
} from '../StackTabs/StackNavigation';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  MyRentals: 'book-online',
  MyTrailors: 'local-shipping',
  Profile: 'person',
};

const tabBarIcon = (routeName) => ({ color, focused }) => (
  <Icon
    name={ICONS[routeName] ?? 'circle'}
    size={focused ? moderateScale(24) : moderateScale(22)}
    color={color}
  />
);

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#E53935',
  tabBarInactiveTintColor: '#555',
  tabBarLabelStyle: { fontSize: moderateScale(11) },
  tabBarStyle: { height: moderateScale(60), paddingBottom: moderateScale(6), paddingTop: 0, backgroundColor: 'red' },
  tabBarItemStyle: { marginTop: 0 },
  safeAreaInsets: { bottom: 0 },
};

const BottomNavigation = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('tab_home'), tabBarIcon: tabBarIcon('Home') }} />
      <Tab.Screen name="MyRentals" component={MyRentalsStack} options={{ tabBarLabel: 'Booking', tabBarIcon: tabBarIcon('MyRentals') }} />
      <Tab.Screen name="MyTrailors" component={MyTrailorsStack} options={{ tabBarLabel: t('tab_my_trailers'), tabBarIcon: tabBarIcon('MyTrailors') }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: t('tab_profile'), tabBarIcon: tabBarIcon('Profile') }} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
