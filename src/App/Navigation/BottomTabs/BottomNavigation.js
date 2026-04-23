import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import {
  HomeStack,
  MyRentalsStack,
  MyTrailorsStack,
  ProfileStack,
} from '../StackTabs/StackNavigation';

const Tab = createBottomTabNavigator();

// ✅ Icon config (component-based, no switch needed)
const ICONS = {
  Home: { name: 'home', component: MaterialIcons },
  MyRentals: { name: 'calendar-month-outline', component: MaterialCommunityIcons },
  MyTrailors: { name: 'trailer', component: FontAwesome5 },
  Profile: { name: 'person-circle-outline', component: Ionicons },
};

// ✅ Tab Icon Renderer
const tabBarIcon =
  routeName =>
  ({ color, focused }) => {
    const icon = ICONS[routeName];
    if (!icon) return null;

    const IconComponent = icon.component;

    return (
      <IconComponent
        name={icon.name}
        size={focused ? moderateScale(24) : moderateScale(22)}
        color={color}
      />
    );
  };

// ✅ Common Screen Options
const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#E53935',
  tabBarInactiveTintColor: '#555',
  tabBarLabelStyle: { fontSize: moderateScale(11) },
  tabBarStyle: {
    height: moderateScale(60),
    paddingBottom: moderateScale(6),
    paddingTop: 0,
  },
  tabBarItemStyle: { marginTop: 0 },
  safeAreaInsets: { bottom: 0 },
};

const BottomNavigation = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: t('tab_home'),
          tabBarIcon: tabBarIcon('Home'),
        }}
      />

      <Tab.Screen
        name="MyRentals"
        component={MyRentalsStack}
        options={{
          tabBarLabel: 'Renter',
          tabBarIcon: tabBarIcon('MyRentals'),
        }}
      />

      <Tab.Screen
        name="MyTrailors"
        component={MyTrailorsStack}
        options={{
          tabBarLabel: 'Owner',
          tabBarIcon: tabBarIcon('MyTrailors'),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('tab_profile'),
          tabBarIcon: tabBarIcon('Profile'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;