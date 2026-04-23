import * as React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth
import WelcomeScreen from '../../../Features/Auth/screens/WelcomeScreen';
import Login from '../../../Features/Auth/screens/Login';
import Register from '../../../Features/Auth/screens/Register';
import LanguageSelect from '../../../Features/Auth/screens/LanguageSelectScreen';
import OtpVerification from '../../../Features/Auth/screens/OtpVerification';
import AccountSettings from '../../../Features/Auth/screens/AccountSettings';
import VerificationScreen from '../../../Features/Auth/screens/VerificationScreen';

// Home & Discovery
import Home from '../../../Features/Home/screens/Home';
import SearchFilterScreen from '../../../Features/Search/screens/SearchFilterScreen';
import LocationSearchScreen from '../../../Features/Search/screens/LocationSearchScreen';
import TrailerSearchResultsScreen from '../../../Features/Trailers/screens/TrailerSearchResultsScreen';
import RenterTrailerDetailScreen from '../../../Features/Trailers/screens/RenterTrailerDetailScreen';
import TowingCompatibilityScreen from '../../../Features/Trailers/screens/TowingCompatibilityScreen';
import Notification from '../../../Features/Notification/screens/Notification';

// Booking
import BookingScreen from '../../../Features/Booking/screens/BookingScreen';
import BookingConfirmationScreen from '../../../Features/Booking/screens/BookingConfirmationScreen';
import BookingDetailScreen from '../../../Features/Booking/screens/BookingDetailScreen';
import PaymentMethodScreen from '../../../Features/Booking/screens/PaymentMethodScreen';
// My Rentals
import MyRentals from '../../../Features/MyRentals/screens/MyRentals';

// Messages
import Messages from '../../../Features/Messages/screens/Messages';
import ChatScreen from '../../../Features/Messages/screens/ChatScreen';
import NewChatScreen from '../../../Features/Messages/screens/NewChatScreen';
import NewGroupChatScreen from '../../../Features/Messages/screens/NewGroupChatScreen';

// Profile & Settings
import Profile from '../../../Features/Profile/screens/Profile';
import EditProfileScreen from '../../../Features/Profile/screens/EditProfileScreen';
import DriverVerificationScreen from '../../../Features/DriverVerification/screens/DriverVerificationScreen';
import SettingsScreen from '../../../Features/Settings/screens/SettingsScreen';
import RenterDashboard from '../../../Features/Dashboard/screens/RenterDashboard';

// Owner
import MyTrailorsScreen from '../../../Features/MyTrailors/screens/MyTrailorsScreen';
import MyTrailersListScreen from '../../../Features/MyTrailors/screens/MyTrailersListScreen';
import MyRecentBookingScreen from '../../../Features/MyTrailors/screens/MyRecentBookingScreen';
import AddTrailorScreen from '../../../Features/MyTrailors/screens/AddTrailorScreen';
import TrailerDetailScreen from '../../../Features/MyTrailors/screens/TrailerDetailScreen';
import OwnerDashboard from '../../../Features/Dashboard/screens/OwnerDashboard';
import BookingRequestsScreen from '../../../Features/BookingRequests/screens/BookingRequestsScreen';
import BookingRequestDetailScreen from '../../../Features/BookingRequests/screens/BookingRequestDetailScreen';
import OwnerBookingsScreen from '../../../Features/OwnerBookings/screens/OwnerBookingsScreen';
import AvailabilityCalendarScreen from '../../../Features/Availability/screens/AvailabilityCalendarScreen';
import EarningsDashboardScreen from '../../../Features/Earnings/screens/EarningsDashboardScreen';
import PayoutSettingsScreen from '../../../Features/Earnings/screens/PayoutSettingsScreen';
import OwnerVerificationScreen from '../../../Features/OwnerVerification/screens/OwnerVerificationScreen';
import OwnerReviewsScreen from '../../../Features/OwnerReviews/screens/OwnerReviewsScreen';

import DrawerToggleButton from '../Drawer/DrawerToggleButton';
import MyTrailorsListScreen from '../../../Features/MyTrailors/screens/MyTrailersListScreen';

/* -------- Stack Instances -------- */
const HomeStackNav = createNativeStackNavigator();
const MessageStackNav = createNativeStackNavigator();
const MyRentalsStackNav = createNativeStackNavigator();
const MyTrailorsStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
/* -------- Auth -------- */
const AuthStack = () => (
  <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
    <AuthStackNav.Screen name="LanguageSelect" component={LanguageSelect} />
    <AuthStackNav.Screen name="Welcome" component={WelcomeScreen} />

    <AuthStackNav.Screen name="Login" component={Login} />
    <AuthStackNav.Screen name="Register" component={Register} />
    <AuthStackNav.Screen name="OtpVerification" component={OtpVerification} />
    <AuthStackNav.Screen name="AccountSettings" component={AccountSettings} />
    <AuthStackNav.Screen name="Verification" component={VerificationScreen} />
  </AuthStackNav.Navigator>
);

/* -------- Home (Renter discovery + booking flow) -------- */
const HomeStack = () => (
  <HomeStackNav.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: {
        height: Platform.OS === 'android' ? 56 : 50,
        elevation: 0,
      },
      headerTitleContainerStyle: { paddingVertical: 0 },
      headerLeftContainerStyle: { paddingLeft: 15 },
      headerStatusBarHeight: 0,
      headerLeft: () => <DrawerToggleButton />,
    }}
  >
    <HomeStackNav.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="SearchFilter"
      component={SearchFilterScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="LocationSearch"
      component={LocationSearchScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="Notification"
      component={Notification}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="TrailerSearchResults"
      component={TrailerSearchResultsScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="RenterTrailerDetail"
      component={RenterTrailerDetailScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="TowingCompatibility"
      component={TowingCompatibilityScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="Booking"
      component={BookingScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="PaymentMethod"
      component={PaymentMethodScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNav.Screen
      name="BookingConfirmation"
      component={BookingConfirmationScreen}
      options={{ headerShown: false, gestureEnabled: false }}
    />
    <HomeStackNav.Screen
      name="AvailabilityCalendar"
      component={AvailabilityCalendarScreen}
      options={{ headerShown: false }}
    />
  </HomeStackNav.Navigator>
);

/* -------- Messages -------- */
const MessageStack = () => (
  <MessageStackNav.Navigator screenOptions={{ headerShown: false }}>
    <MessageStackNav.Screen name="Messages" component={Messages} />
    <MessageStackNav.Screen name="Chat" component={ChatScreen} />
    <MessageStackNav.Screen name="NewChat" component={NewChatScreen} />
    <MessageStackNav.Screen
      name="NewGroupChat"
      component={NewGroupChatScreen}
    />
  </MessageStackNav.Navigator>
);

/* -------- Renter: My Rentals -------- */
const MyRentalsStack = () => (
  <MyRentalsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <MyRentalsStackNav.Screen name="MyRentals" component={MyRentals} />
    <MyRentalsStackNav.Screen
      name="BookingDetail"
      component={BookingDetailScreen}
    />
  </MyRentalsStackNav.Navigator>
);

/* -------- Owner: My Trailers -------- */
const MyTrailorsStack = () => (
  <MyTrailorsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <MyTrailorsStackNav.Screen name="MyTrailors" component={MyTrailorsScreen} />
    <MyTrailorsStackNav.Screen
      name="MyTrailorsList"
      component={MyTrailersListScreen}
    />
    <MyTrailorsStackNav.Screen
      name="MyRecentBooking"
      component={MyRecentBookingScreen}
    />
    <MyTrailorsStackNav.Screen name="AddTrailor" component={AddTrailorScreen} />
    <MyTrailorsStackNav.Screen
      name="TrailerDetail"
      component={TrailerDetailScreen}
    />
    <MyTrailorsStackNav.Screen
      name="OwnerDashboard"
      component={OwnerDashboard}
    />
    <MyTrailorsStackNav.Screen
      name="BookingRequests"
      component={BookingRequestsScreen}
    />
    <MyTrailorsStackNav.Screen
      name="BookingRequestDetail"
      component={BookingRequestDetailScreen}
    />
    <MyTrailorsStackNav.Screen
      name="OwnerBookings"
      component={OwnerBookingsScreen}
    />
    <MyTrailorsStackNav.Screen
      name="AvailabilityCalendar"
      component={AvailabilityCalendarScreen}
    />
    <MyTrailorsStackNav.Screen
      name="EarningsDashboard"
      component={EarningsDashboardScreen}
    />
    <MyTrailorsStackNav.Screen
      name="PayoutSettings"
      component={PayoutSettingsScreen}
    />
    <MyTrailorsStackNav.Screen
      name="OwnerVerification"
      component={OwnerVerificationScreen}
    />
    <MyTrailorsStackNav.Screen
      name="OwnerReviews"
      component={OwnerReviewsScreen}
    />
  </MyTrailorsStackNav.Navigator>
);

/* -------- Profile (shared by all roles) -------- */
const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="Profile" component={Profile} />
    <ProfileStackNav.Screen name="EditProfile" component={EditProfileScreen} />
    {/* Renter */}
    <ProfileStackNav.Screen name="MyRentals" component={MyRentals} />
    <ProfileStackNav.Screen
      name="DriverVerification"
      component={DriverVerificationScreen}
    />
    <ProfileStackNav.Screen
      name="RenterDashboard"
      component={RenterDashboard}
    />
    <ProfileStackNav.Screen
      name="BookingDetail"
      component={BookingDetailScreen}
    />
    <ProfileStackNav.Screen
      name="RenterTrailerDetail"
      component={RenterTrailerDetailScreen}
    />
    <ProfileStackNav.Screen
      name="TowingCompatibility"
      component={TowingCompatibilityScreen}
    />
    <ProfileStackNav.Screen name="Booking" component={BookingScreen} />
    <ProfileStackNav.Screen
      name="BookingConfirmation"
      component={BookingConfirmationScreen}
    />
    {/* Shared */}
    <ProfileStackNav.Screen name="Settings" component={SettingsScreen} />
    {/* Owner */}
    <ProfileStackNav.Screen name="OwnerDashboard" component={OwnerDashboard} />
    <ProfileStackNav.Screen
      name="BookingRequests"
      component={BookingRequestsScreen}
    />
    <ProfileStackNav.Screen
      name="BookingRequestDetail"
      component={BookingRequestDetailScreen}
    />
    <ProfileStackNav.Screen
      name="OwnerBookings"
      component={OwnerBookingsScreen}
    />
    <ProfileStackNav.Screen
      name="AvailabilityCalendar"
      component={AvailabilityCalendarScreen}
    />
    <ProfileStackNav.Screen
      name="EarningsDashboard"
      component={EarningsDashboardScreen}
    />
    <ProfileStackNav.Screen
      name="PayoutSettings"
      component={PayoutSettingsScreen}
    />
    <ProfileStackNav.Screen
      name="OwnerVerification"
      component={OwnerVerificationScreen}
    />
    <ProfileStackNav.Screen
      name="OwnerReviews"
      component={OwnerReviewsScreen}
    />
    <ProfileStackNav.Screen name="MyTrailors" component={MyTrailorsScreen} />
    <ProfileStackNav.Screen name="AddTrailor" component={AddTrailorScreen} />
    <ProfileStackNav.Screen
      name="TrailerDetail"
      component={TrailerDetailScreen}
    />
  </ProfileStackNav.Navigator>
);

export {
  HomeStack,
  MessageStack,
  MyRentalsStack,
  MyTrailorsStack,
  ProfileStack,
  AuthStack,
};
