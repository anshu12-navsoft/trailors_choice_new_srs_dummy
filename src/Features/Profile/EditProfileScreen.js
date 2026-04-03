import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import CustomTextInput from '../../Components/TextInput/CustomTextInput';
import CustomButton from '../../Components/Buttons/CustomButton';
import DateTimePicker from '../../Components/DateTimePicker/DateTimePicker';
import {
  openCamera,
  openGallery,
} from '../../utils/helpers/mediaPicker.helper';
import colors from '../../Constants/Colors';
import { styles } from './EditProfile.style';
const STATUS_CONFIG = {
  active: { labelKey: 'account_status_active', bg: '#D1FAE5', text: '#065F46' },
  restricted: {
    labelKey: 'account_status_restricted',
    bg: '#FEF3C7',
    text: '#92400E',
  },
  suspended: {
    labelKey: 'account_status_suspended',
    bg: '#FEE2E2',
    text: '#991B1B',
  },
};

const EditProfileScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const accountStatus = route?.params?.accountStatus ?? 'active';

  // ── form state ────────────────────────────────────────────────
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState(route?.params?.name ?? '');
  const [dob, setDob] = useState(null);
  const [phone, setPhone] = useState(route?.params?.phone ?? '');
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── photo picker ──────────────────────────────────────────────
  const handlePickPhoto = () => {
    Alert.alert(
      t('profile_photo_title'),
      t('choose_option'),
      [
        {
          text: t('camera_option'),
          onPress: async () => {
            try {
              const file = await openCamera();
              if (file) setPhoto(file);
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
        {
          text: t('gallery_option'),
          onPress: async () => {
            try {
              const file = await openGallery();
              if (file) setPhoto(file);
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
        photo && {
          text: t('remove_photo'),
          style: 'destructive',
          onPress: () => setPhoto(null),
        },
        { text: t('cancel_button'), style: 'cancel' },
      ].filter(Boolean),
    );
  };

  // ── validation ────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = t('full_name_label') + ' is required';
    if (!phone.trim()) newErrors.phone = t('phone_required');
    if (phone.trim() && !/^\+?[\d\s\-()]{7,15}$/.test(phone.trim())) {
      newErrors.phone = t('phone_invalid');
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t('email_invalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Replace with your API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      Alert.alert(t('profile_saved'), t('profile_save_message'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert(t('profile_save_error'), t('profile_save_error_message'));
    } finally {
      setSaving(false);
    }
  };

  const statusCfg = STATUS_CONFIG[accountStatus] ?? STATUS_CONFIG.active;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── top bar ── */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Icon
              name="arrow-left"
              size={moderateScale(22)}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text style={styles.topBarTitle}>
            {t('edit_profile_screen_title')}
          </Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── account status badge ── */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{t('account_status_label')}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusCfg.text }]}
              />
              <Text style={[styles.statusText, { color: statusCfg.text }]}>
                {t(statusCfg.labelKey)}
              </Text>
            </View>
          </View>

          {/* ── profile photo ── */}
          <View style={styles.photoSection}>
            <Pressable onPress={handlePickPhoto} style={styles.avatarWrapper}>
              {photo ? (
                <Image source={{ uri: photo.uri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="user" size={moderateScale(36)} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Icon name="camera" size={moderateScale(14)} color="#fff" />
              </View>
            </Pressable>
            <Text style={styles.photoHint}>{t('tap_to_change_photo')}</Text>
          </View>

          {/* ── personal details ── */}
          <SectionHeader title={t('personal_details_section')} icon="user" />

          <CustomTextInput
            label={t('full_name_label')}
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(e => ({ ...e, name: null }));
            }}
            placeholder={t('full_name_label')}
            error={errors.name}
          />

          <View style={styles.dobWrapper}>
            <DateTimePicker
              label={t('date_of_birth_label')}
              mode="date"
              placeholder={t('select_date_of_birth')}
              maximumDate={new Date()}
              onDateChange={setDob}
              customStyles={{
                container: {
                  width: '100%',
                  alignSelf: 'auto',
                  marginVertical: 0,
                },
              }}
            />
          </View>

          <SectionHeader title={t('address_section')} icon="map-pin" />

          <CustomTextInput
            label={t('street_address_label')}
            value={street}
            onChangeText={setStreet}
            placeholder={t('street_address_placeholder')}
          />

          <View style={styles.row}>
            <CustomTextInput
              label={t('city_label')}
              value={city}
              onChangeText={setCity}
              placeholder={t('city_placeholder')}
              style={styles.halfInput}
            />
            <CustomTextInput
              label={t('state_label')}
              value={state}
              onChangeText={setState}
              placeholder={t('state_placeholder')}
              style={styles.halfInput}
            />
          </View>

          <CustomTextInput
            label={t('zip_postal_code_label')}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder={t('zip_postal_code_placeholder')}
            keyboardType="number-pad"
          />

          {/* ── contact information ── */}
          <SectionHeader
            title={t('contact_information_section')}
            icon="phone"
          />

          <CustomTextInput
            label={t('phone_number_label')}
            value={phone}
            onChangeText={text => {
              setPhone(text);
              if (errors.phone) setErrors(e => ({ ...e, phone: null }));
            }}
            placeholder={t('phone_number_placeholder')}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <CustomTextInput
            label={t('email_address_label')}
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) setErrors(e => ({ ...e, email: null }));
            }}
            placeholder={t('email_address_placeholder')}
            keyboardType="email-address"
            error={errors.email}
          />

          {/* ── save ── */}
          <CustomButton
            title={t('save_changes_button')}
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            size="large"
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ── small helper component ─────────────────────────────────────
const SectionHeader = ({ title, icon }) => (
  <View style={sectionStyles.row}>
    <Icon name={icon} size={moderateScale(14)} color={colors.primary} />
    <Text style={sectionStyles.text}>{title}</Text>
  </View>
);

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(8),
  },
  text: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});

export default EditProfileScreen;
