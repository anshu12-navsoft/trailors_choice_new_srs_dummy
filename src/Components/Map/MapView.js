import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const CustomMapView = ({ style }) => {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.text}>Map unavailable</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    height: moderateScale(220),
    borderRadius: moderateScale(14),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: moderateScale(13),
    color: '#9CA3AF',
  },
});

export default CustomMapView;
