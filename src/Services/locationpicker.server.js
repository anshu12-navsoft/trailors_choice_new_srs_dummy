import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const LocationPicker = ({onZipSelected}) => {
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);

  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      let result = await check(permission);

      if (result === RESULTS.GRANTED) return true;

      if (result === RESULTS.DENIED) {
        result = await request(permission);
        return result === RESULTS.GRANTED;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Please enable location permission from settings.',
        );
        return false;
      }

      return false;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const detectLocation = async () => {
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission required.');
      return;
    }

    setLoading(true);

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        console.log('Lat:', latitude, 'Lon:', longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          const data = await response.json();

          console.log('Full address response:', data);

          const zipCode =
            data?.address?.postcode ||
            data?.address?.postal_code ||
            data?.address?.zip ||
            '';

          if (!zipCode) {
            Alert.alert('ZIP not found', 'Please enter ZIP manually.');
          }

          setZip(zipCode);
          onZipSelected?.(zipCode);

        } catch (error) {
          console.log('Reverse geocode error:', error);
        }

        setLoading(false);
      },
      error => {
        console.log('Location error:', error);
        Alert.alert('Location Error', error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const handleManualEntry = value => {
    setZip(value);
    onZipSelected?.(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>

      <TouchableOpacity style={styles.autoBtn} onPress={detectLocation}>
        <Text style={styles.autoText}>Auto Detect Location</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="small"
          style={{marginTop: 10}}
        />
      )}

      <Text style={styles.or}>OR</Text>

      <TextInput
        placeholder="Enter ZIP Code"
        value={zip}
        keyboardType="numeric"
        onChangeText={handleManualEntry}
        style={styles.input}
      />
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
  },

  autoBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  autoText: {
    color: '#fff',
    fontWeight: '600',
  },

  or: {
    textAlign: 'center',
    marginVertical: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});