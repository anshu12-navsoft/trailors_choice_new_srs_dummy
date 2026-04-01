import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../Components/Buttons/CustomButton';

const WelcomeScreen = ({ navigation }) => {
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safe} edges={[]}>

      {/* Top image / hero area */}
      <View style={[styles.hero, { height: height * 0.52 }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Icon name="truck-trailer" size={moderateScale(22)} color="#CC2229" />
          <Text style={styles.logoText}>
            <Text style={styles.logoTrailer}>Trailer</Text>
            <Text style={styles.logoChoices}>Choices</Text>
          </Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <Text style={styles.heading}>The Smart Way to{'\n'}Rent a Trailer</Text>

        {/* Continue with Phone */}
        <CustomButton
          title="Continue with Phone"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          size="large"
          style={styles.phoneBtn}
        />

        {/* Or divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.orLine} />
        </View>

        {/* Continue with Google */}
        <CustomButton
          title="Continue with Google"
          onPress={() => {}}
          variant="outline"
          size="large"
          style={styles.socialBtn}
          leftIcon={
            <Icon name="google" size={moderateScale(18)} color="#4285F4" />
          }
        />

        {/* Continue with Apple */}
        <CustomButton
          title="Continue with Apple"
          onPress={() => {}}
          variant="outline"
          size="large"
          style={styles.socialBtn}
          leftIcon={
            <Icon name="apple" size={moderateScale(20)} color="#000" />
          }
        />
      </View>

    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  /* Hero */
  hero: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-start',
    paddingTop: moderateScale(48),
    paddingHorizontal: moderateScale(20),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  logoText: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  logoTrailer: {
    color: '#1A1A2E',
  },
  logoChoices: {
    color: '#CC2229',
    fontStyle: 'italic',
  },

  /* Sheet */
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(28),
    gap: moderateScale(12),
  },
  heading: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: '#111827',
    lineHeight: moderateScale(34),
    marginBottom: moderateScale(8),
  },

  phoneBtn: {
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginVertical: moderateScale(2),
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
  },
  orText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    fontWeight: '500',
  },

  socialBtn: {
    borderRadius: moderateScale(10),
    borderColor: '#D1D5DB',
  },
});
