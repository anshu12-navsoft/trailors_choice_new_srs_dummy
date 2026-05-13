import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { styles } from '../stylesheets/MyRecentBookings.style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from '../../../Components/Header/CustomHeader';

const MOCK_BOOKINGS = [
  {
    id: '1',
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=32',
    date: '24 Feb - 28 Feb',
    status: 'requested',
    extra: '7 Days Rental',
  },
  {
    id: '2',
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=32',
    date: '24 Feb - 28 Feb',
    status: 'in_progress',
    extra: 'Return Tomorrow',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=53',
    date: '28 Feb - 5 Mar',
    status: 'confirmed',
    extra: '3 Days Rental',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=47',
    date: '5 Mar - 10 Mar',
    status: 'cancelled',
  },
  {
    id: '5',
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=60',
    date: '10 Mar - 15 Mar',
    status: 'completed',
    extra: '3 Days Rental',
  },
  {
    id: '6',
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=60',
    date: '15 Mar - 20 Mar',
    status: 'completed',
    extra: '3 Days Rental',
  },
];

const BookingRow = ({ item }) => {
  const renderStatus = () => {
    switch (item.status) {
      case 'requested':
        return <Text style={styles.statusRequested}>Requested</Text>;
      case 'in_progress':
        return <Text style={styles.statusInProgress}>In Progress</Text>;
      case 'confirmed':
        return <Text style={styles.statusConfirmed}>Confirmed</Text>;
      case 'cancelled':
        return <Text style={styles.statusCancelled}>Cancelled</Text>;
      case 'completed':
        return <Text style={styles.statusCompleted}>Completed</Text>;
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (item.status) {
      case 'requested':
        return (
          <View style={styles.actionRow}>
            <Pressable style={styles.acceptBtn}>
              <Text style={styles.acceptText}>Accept</Text>
            </Pressable>
            <Pressable style={styles.declineBtn}>
              <Text style={styles.declineText}>Decline</Text>
            </Pressable>
          </View>
        );
      case 'in_progress':
        return (
          <Pressable style={styles.singleBtn}>
            <Text style={styles.singleBtnText}>Confirm Return</Text>
          </Pressable>
        );
      case 'confirmed':
        return (
          <Pressable style={styles.singleBtn}>
            <Text style={styles.singleBtnText}>Confirm Pickup</Text>
          </Pressable>
        );
      case 'completed':
        return (
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <Icon key={i} name="star-outline" size={24} color="#D1D5DB" />
              ))}
            </View>
            <Text style={styles.rateText}>Rate Renter</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {renderStatus()}
          {item.extra && <Text style={styles.extra}>{item.extra}</Text>}
        </View>
      </View>
      {renderActions()}
    </View>
  );
};

const MyRecentBookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      // TODO: replace with API call when ready
      // const res = await fetch(`/api/bookings?status=${status}`);
      // const data = await res.json();
      // setBookings(data);
      setBookings(MOCK_BOOKINGS);
    } catch (err) {
      console.log(err);
    }
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'Active':
        return bookings.filter(t => ['requested', 'in_progress', 'confirmed'].includes(t.status));
      case 'Upcoming':
        return bookings.filter(t => t.status === 'upcoming');
      case 'Completed':
        return bookings.filter(t => t.status === 'completed');
      case 'All':
      default:
        return bookings;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <CustomHeader title="Manage Trailer" onBack={() => navigation.goBack()} />

      <View style={styles.toggle}>
        {['All', 'Active', 'Upcoming', 'Completed'].map(tab => (
          <Pressable
            key={tab}
            style={[styles.toggleTab, activeTab === tab && styles.toggleTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.toggleText, activeTab === tab && styles.toggleTextActive]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {getFilteredBookings().map(item => (
          <BookingRow key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyRecentBookingScreen;
