import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

import BottomNavigation from '../BottomTabs/BottomNavigation';
import { useColors } from '../../../Theme/ThemeContext';
import Payment from "../../../Features/Payment/screens/PaymentScreen"
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,

        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerLabelStyle: {
          fontSize: 14,
        },

        /* 🔥 THIS is what you want */
        drawerHideStatusBarOnOpen: true,
        drawerStatusBarAnimation: 'slide', // 'fade' | 'none'
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={BottomNavigation}
        initialParams={{ screen: 'Home' }}
        options={{
          title: t('tab_home'),
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="MessagesDrawer"
        component={BottomNavigation}
        initialParams={{ screen: 'Messages' }}
        options={{
          title: t('tab_messages'),
          drawerIcon: ({ color, size }) => (
            <Icon name="chat" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="MyRentalsDrawer"
        component={BottomNavigation}
        initialParams={{ screen: 'MyRentals' }}
        options={{
          title: t('tab_my_rentals'),
          drawerIcon: ({ color, size }) => (
            <Icon name="directions-car" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="ProfileDrawer"
        component={BottomNavigation}
        initialParams={{ screen: 'Profile' }}
        options={{
          title: t('tab_profile'),
          drawerIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="PaymentDrawer"
        component={Payment}
        initialParams={{ screen: 'Payment' }}
        options={{
          title: t('tab_payment'),
          drawerIcon: ({ color, size }) => (
            <Icon name="payment" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
