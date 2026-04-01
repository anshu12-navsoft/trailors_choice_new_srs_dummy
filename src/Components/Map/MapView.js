import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { moderateScale } from 'react-native-size-matters';

const CustomMapView = ({
  latitude,
  longitude,
  title,
  description,
  style,
  markers = [],
  zoomLevel = 14,
  scrollEnabled = true,
  zoomEnabled = true,
  showsUserLocation = false,
}) => {
  if (!latitude || !longitude) {
    return (
      <View style={[styles.placeholder, style]}>
        <ActivityIndicator color="#16A34A" />
      </View>
    );
  }

  const region = {
    latitude,
    longitude,
    latitudeDelta: 360 / Math.pow(2, zoomLevel),
    longitudeDelta: 360 / Math.pow(2, zoomLevel),
  };

  return (
    <MapView
      style={[styles.map, style]}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsUserLocation}
    >
      {/* Primary marker */}
      {title ? (
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          description={description}
        />
      ) : null}

      {/* Additional markers */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: moderateScale(220),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: moderateScale(220),
    borderRadius: moderateScale(14),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomMapView;
