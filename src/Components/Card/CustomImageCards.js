import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const CustomImageCard = ({
  image,
  title,
  location,
  price,
  description,
  rating,
  owner,
  onPress,
  onWishlistPress,
  style,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Card mode="elevated" onPress={onPress} style={[styles.card, style]}>
      {/* Cover image with wishlist button */}
      <Card.Cover source={{ uri: image }} style={styles.image} />

      <IconButton
        icon="heart-outline"
        size={moderateScale(18)}
        iconColor={colors.success ?? '#16A34A'}
        style={[styles.wishlistBtn, { backgroundColor: colors.background }]}
        onPress={onWishlistPress}
      />

      <Card.Content style={styles.content}>
        {/* Location */}
        <View style={styles.locationRow}>
          <Icon name="location-outline" size={14} color={colors.success ?? '#16A34A'} />
          <Text variant="labelSmall" style={{ color: colors.success ?? '#16A34A', marginLeft: 4 }}>
            {location}
          </Text>
        </View>

        {/* Title */}
        <Text variant="titleMedium" numberOfLines={1}>
          {title}
        </Text>

        {/* Price */}
        <Text variant="titleMedium" style={{ color: colors.success ?? '#16A34A', marginTop: moderateScale(4) }}>
          ${price}
          <Text variant="bodySmall" style={{ color: colors.success ?? '#16A34A' }}>
            {t('per_day_label')}
          </Text>
        </Text>

        {/* Description */}
        <Text variant="bodySmall" numberOfLines={2} style={[styles.description, { color: colors.onSurfaceVariant }]}>
          {description}
        </Text>

        <Divider style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.ownerRow}>
            <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]} />
            <Text variant="labelSmall" style={{ color: colors.onSurface }}>
              {t('by_owner', { owner })}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Text variant="labelSmall" style={{ marginRight: 4, color: colors.onSurface }}>
              {rating}
            </Text>
            <Icon name="star" size={14} color="#F59E0B" />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },

  image: {
    height: moderateScale(180),
    borderRadius: 0,
  },

  wishlistBtn: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    borderRadius: 999,
    margin: 0,
  },

  content: {
    padding: moderateScale(14),
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },

  description: {
    marginTop: moderateScale(6),
    lineHeight: moderateScale(18),
  },

  divider: {
    marginVertical: moderateScale(10),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: 11,
    marginRight: 6,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomImageCard;
