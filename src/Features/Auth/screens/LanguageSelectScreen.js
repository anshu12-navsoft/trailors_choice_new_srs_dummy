   import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import i18n from '../../../Services/bilingual_il8n/index';
import { useTranslation } from 'react-i18next';

/* ── Constants ───────────────────────────────────────────────────────────── */

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
];

/* ── Screen ──────────────────────────────────────────────────────────────── */

const LanguageSelectScreen = ({ navigation }) => {
  const { t } = useTranslation();

  // Single source of truth — initialise from whatever i18n already has
  const [selectedCode, setSelectedCode] = useState(
    i18n.language?.startsWith('es') ? 'es' : 'en',
  );

  const handleSelectLanguage = code => {
    i18n.changeLanguage(code); // same pattern as SettingsScreen
    setSelectedCode(code);
  };

  const handleContinue = () => {
    navigation.navigate('Welcome', { language: selectedCode });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Logo ── */}
      <View style={styles.logoRow}>
        <View style={styles.logoIconWrapper}>
          <Text style={styles.logoTC}>TC</Text>
        </View>
        <View style={styles.logoTextWrapper}>
          <Text style={styles.logoTitle}>
            <Text style={styles.logoTrailer}>Trailer</Text>
            <Text style={styles.logoChoices}>Choices</Text>
            <Text style={styles.logoRegistered}>®</Text>
          </Text>
          <Text style={styles.logoTaglineEn}>Find the Fit. Rent with Confidence.</Text>
          <Text style={styles.logoTaglineEs}>Encuentra el Ideal. Renta con Confianza.</Text>
        </View>
      </View>

      {/* ── Hero Image ── */}
      <View style={styles.heroWrapper}>
        {/*
          Replace placeholders with actual images:
          <Image source={require('../Assets/trailer_open.png')} style={styles.trailerLeft} resizeMode="contain" />
          <Image source={require('../Assets/trailer_enclosed.png')} style={styles.trailerRight} resizeMode="contain" />
        */}
        <View style={[styles.trailerPlaceholder, styles.trailerLeft]}>
          <Text style={styles.placeholderText}>🚛</Text>
        </View>
        <View style={[styles.trailerPlaceholder, styles.trailerRight]}>
          <Text style={styles.placeholderText}>📦</Text>
        </View>
      </View>

      {/* ── Language Selector ── */}
      <View style={styles.languageRow}>
        {LANGUAGES.map(lang => {
          const isSelected = selectedCode === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={[
                styles.langButton,
                isSelected && styles.langButtonSelected,
              ]}
              onPress={() => handleSelectLanguage(lang.code)}
              android_ripple={{ color: '#e0e0e0', borderless: false }}
            >
              <Text style={styles.flagEmoji}>{lang.flag}</Text>
              <Text
                style={[
                  styles.langLabel,
                  isSelected && styles.langLabelSelected,
                ]}
              >
                {lang.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Continue Button ── */}
      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.continueButtonPressed,
        ]}
        onPress={handleContinue}
        android_ripple={{ color: '#c0392b' }}
      >
        <Text style={styles.continueLabel}>{t('continue') ?? 'Continue'}</Text>
      </Pressable>
    </SafeAreaView>
  );
};

/* ── Styles ──────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(24),
    justifyContent: 'space-between',
    paddingBottom: verticalScale(24),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
    gap: moderateScale(12),
  },
  logoIconWrapper: {
    width: moderateScale(52),
    height: moderateScale(52),
    backgroundColor: '#1A2B6D',
    borderRadius: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTC: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoTextWrapper: { flex: 1 },
  logoTitle: { fontSize: moderateScale(18), fontWeight: '700' },
  logoTrailer: { color: '#1A2B6D', fontWeight: '800' },
  logoChoices: { color: '#E53935', fontWeight: '800', fontStyle: 'italic' },
  logoRegistered: { color: '#1A2B6D', fontSize: moderateScale(10), fontWeight: '400' },
  logoTaglineEn: { fontSize: moderateScale(10), color: '#444', marginTop: verticalScale(2) },
  logoTaglineEs: { fontSize: moderateScale(9), color: '#888', fontStyle: 'italic' },
  heroWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    gap: moderateScale(16),
  },
  trailerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: moderateScale(8),
  },
  trailerLeft: { width: scale(130), height: verticalScale(110) },
  trailerRight: { width: scale(120), height: verticalScale(100) },
  placeholderText: { fontSize: moderateScale(48) },
  languageRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
  },
  langButtonSelected: {
    borderColor: '#1A2B6D',
    backgroundColor: '#EEF1FB',
  },
  flagEmoji: { fontSize: moderateScale(20) },
  langLabel: { fontSize: moderateScale(15), fontWeight: '500', color: '#333' },
  langLabelSelected: { color: '#1A2B6D', fontWeight: '700' },
  continueButton: {
    backgroundColor: '#E53935',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E53935',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  continueButtonPressed: { backgroundColor: '#C62828' },
  continueLabel: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LanguageSelectScreen;