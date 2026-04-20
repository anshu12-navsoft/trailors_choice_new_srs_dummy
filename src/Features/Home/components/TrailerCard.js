import React, { useState } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../../App/Redux/Slices/trailerSlice';
import CustomSearchInput from '../../../Components/TextInput/CustomSearchInput';
import CustomIconButton from '../../../Components/Buttons/CustomIconButton';
import CustomButton from '../../../Components/Buttons/CustomButton';
import CustomCards from '../../../Components/Card/CustomCards';
import {styles} from "../stylesheets/Home.style"

const TrailerCard = ({ item, onPress }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const imageSize = (width - moderateScale(12) * 2 - moderateScale(8)) / 2;

  return (
    <CustomCards
      variant="flat"
      onPress={onPress}
      style={styles.trailerCard}
      contentStyle={{ padding: 0 }}
    >
      {/* Image */}
      <View
        style={[
          styles.trailerImage,
          { width: imageSize, height: imageSize * 0.8 },
        ]}
      >
        <Icon name="image" size={moderateScale(32)} color="#C0C0C0" />
      </View>

      {/* Caption */}
      <View style={styles.caption}>
        <Text variant="titleSmall" style={styles.trailerTitle}>
          {item.title}
        </Text>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          {item.distance} - {item.address}
        </Text>
        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
          {item.dims}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="labelMedium">
            <Text style={styles.priceBold}>${item.priceDay}</Text>
            <Text style={{ color: colors.onSurfaceVariant }}>/day</Text>
          </Text>
          <Text variant="labelMedium">
            <Text style={styles.priceBold}>${item.priceWeek}</Text>
            <Text style={{ color: colors.onSurfaceVariant }}>/week</Text>
          </Text>
        </View>
      </View>
    </CustomCards>
  );
};
export default TrailerCard;