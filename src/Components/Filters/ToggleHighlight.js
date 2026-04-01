import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

const ToggleHighlight = ({
  options = [],
  selectedValue,
  onChange,

  // Sizing
  height = 40,
  width = '100%',
  padding = 4,

  // Border Radius
  containerRadius = 12,
  pillRadius,

  // Colors
  trackColor = '#F0F0F0',
  pillColor = '#FFFFFF',
  activeTextColor = '#000000',
  inactiveTextColor = '#8E8E93',

  // Shadow
  showPillShadow = true,
  pillElevation = 4,
  pillShadowColor = '#000000',

  // Typography
  fontSize = 14,
  fontWeight = '600',
  fontFamily,

  // Badge
  badgeColor = '#FF3B30',
  badgeTextColor = '#FFFFFF',
  badgeSize = 18,

  // Misc
  animationDuration = 200,
  containerStyle,
}) => {
  const count = options.length;
  const resolvedPillRadius = pillRadius ?? Math.max(containerRadius - padding, 0);

  const initialIndex = Math.max(
    options.findIndex((o) => o.value === selectedValue),
    0,
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [innerWidth, setInnerWidth] = useState(0);
  const pillWidth = innerWidth > 0 ? innerWidth / count : 0;

  const translateX = useRef(new Animated.Value(initialIndex * pillWidth)).current;

  const handleLayout = (e) => {
    const w = e.nativeEvent.layout.width;
    setInnerWidth(w);
    translateX.setValue(activeIndex * (w / count));
  };

  const handlePress = (index, value) => {
    setActiveIndex(index);
    Animated.spring(translateX, {
      toValue: index * pillWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
    onChange?.(value);
  };

  const pillShadowStyle = showPillShadow
    ? {
        shadowColor: pillShadowColor,
        shadowOffset: { width: 0, height: pillElevation / 2 },
        shadowOpacity: 0.12 + pillElevation * 0.015,
        shadowRadius: pillElevation,
        elevation: pillElevation,
      }
    : {};

  return (
    <View
      style={[
        styles.outer,
        {
          height,
          width,
          backgroundColor: trackColor,
          borderRadius: containerRadius,
          padding,
        },
        containerStyle,
      ]}
    >
      {/* Sliding pill */}
      <Animated.View
        style={[
          styles.pill,
          pillShadowStyle,
          {
            width: pillWidth,
            height: height - padding * 2,
            top: padding,
            left: padding,
            borderRadius: resolvedPillRadius,
            backgroundColor: pillColor,
            transform: [{ translateX }],
          },
        ]}
      />

      {/* Labels row */}
      <View style={styles.labelsRow} onLayout={handleLayout}>
        {options.map((opt, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => handlePress(index, opt.value)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? activeTextColor : inactiveTextColor,
                    fontSize,
                    fontWeight,
                    fontFamily,
                  },
                ]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>

              {/* Badge */}
              {opt.badge != null && opt.badge > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: badgeColor,
                      width: badgeSize,
                      height: badgeSize,
                      borderRadius: badgeSize / 2,
                      marginLeft: 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: badgeTextColor, fontSize: badgeSize * 0.6 },
                    ]}
                  >
                    {opt.badge > 99 ? '99+' : opt.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 0,
  },
  labelsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
});

export default ToggleHighlight;


// ─── Example Usage ────────────────────────────────────────────────────────────
//
// import SegmentedControl from './SegmentedControl';
//
// const TABS = [
//   { label: 'Delivery', value: 'delivery' },
//   { label: 'Pickup',   value: 'pickup', badge: 1 },
// ];
//
// export default function App() {
//   const [tab, setTab] = useState('delivery');
//   return (
//     <View style={{ padding: 20, gap: 16 }}>
//
//       {/* Exact replica of screenshot */}
//  <ToggleHighlight
//           options={DELIVERY_TABS}
//           selectedValue={deliveryTab}
//           onChange={setDeliveryTab}
//           width={180}
//           height={38}
//           containerRadius={10}
//         />
//
//       {/* Pill / capsule style */}
{/* <ToggleHighlight
          options={DELIVERY_TABS}
          selectedValue={pillTab}
          onChange={setPillTab}
          height={48}
          containerRadius={24}
          trackColor="#E8F0FE"
          pillColor="#4285F4"
          activeTextColor="#FFFFFF"
          inactiveTextColor="#4285F4"
        /> */}
//
//       {/* Dark theme with 3 tabs */}
        // <ToggleHighlight
        //   options={STATUS_TABS}
        //   selectedValue={statusTab}
        //   onChange={setStatusTab}
        //   height={44}
        //   containerRadius={8}
        //   trackColor="#1C1C1E"
        //   pillColor="#2C2C2E"
        //   activeTextColor="#FFFFFF"
        //   inactiveTextColor="#636366"
        // />
//     </View>
//   );
// }