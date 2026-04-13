import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../../../Components/Buttons/CustomButton';
import colors from '../../../Constants/Colors';
import Fonts from '../../../Theme/Fonts';
import {
  openCamera,
  openGallery,
} from '../../../utils/helpers/mediaPicker.helper';
import { styles } from '../stylesheets/DriverVerification.style';
import CustomHeader from '../../../Components/Header/CustomHeader';
// ── status config ──────────────────────────────────────────────────────────
const STATUS = {
  not_submitted: {
    label: 'Not Submitted',
    color: colors.textDisabled,
    bg: '#F3F4F6',
    icon: 'clock',
  },
  pending: {
    label: 'Pending Review',
    color: '#D97706',
    bg: '#FEF3C7',
    icon: 'loader',
  },
  approved: {
    label: 'Approved',
    color: colors.success,
    bg: '#D1FAE5',
    icon: 'check-circle',
  },
  rejected: {
    label: 'Rejected',
    color: colors.error,
    bg: '#FEE2E2',
    icon: 'x-circle',
  },
};

// ── upload card ────────────────────────────────────────────────────────────
const UploadCard = ({ label, sublabel, uri, onPickGallery, onPickCamera }) => {
  const { t } = useTranslation();
  const showPicker = () => {
    Alert.alert(label, t('choose_option'), [
      { text: t('camera_option'), onPress: onPickCamera },
      { text: t('gallery_option'), onPress: onPickGallery },
      { text: t('cancel_button'), style: 'cancel' },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.uploadCard, pressed && { opacity: 0.85 }]}
      onPress={showPicker}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.uploadPreview}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.uploadPlaceholder}>
          <Icon
            name="upload"
            size={moderateScale(28)}
            color={colors.textDisabled}
          />
          <Text style={styles.uploadLabel}>{label}</Text>
          {sublabel ? (
            <Text style={styles.uploadSublabel}>{sublabel}</Text>
          ) : null}
        </View>
      )}

      {/* edit overlay if image set */}
      {uri && (
        <View style={styles.uploadEditBadge}>
          <Icon name="edit-2" size={moderateScale(12)} color="#fff" />
        </View>
      )}
    </Pressable>
  );
};

// ── status banner ──────────────────────────────────────────────────────────
const StatusBanner = ({ status }) => {
  const { t } = useTranslation();
  const cfg = STATUS[status];
  return (
    <View style={[styles.statusBanner, { backgroundColor: cfg.bg }]}>
      <Icon name={cfg.icon} size={moderateScale(18)} color={cfg.color} />
      <View style={styles.statusTextWrap}>
        <Text style={[styles.statusLabel, { color: cfg.color }]}>
          {t('verification_status_prefix')}
          {cfg.label}
        </Text>
        {status === 'pending' && (
          <Text style={styles.statusHint}>{t('under_review_message')}</Text>
        )}
        {status === 'rejected' && (
          <Text style={styles.statusHint}>
            {t('rejected_documents_message')}
          </Text>
        )}
        {status === 'approved' && (
          <Text style={styles.statusHint}>{t('approved_message')}</Text>
        )}
        {status === 'not_submitted' && (
          <Text style={styles.statusHint}>{t('not_submitted_message')}</Text>
        )}
      </View>
    </View>
  );
};

// ── validation helpers ─────────────────────────────────────────────────────
const validateLicense = (front, back, expiry) => {
  if (!front) return "Please upload the front of your driver's license.";
  if (!back) return "Please upload the back of your driver's license.";
  if (!expiry) return 'Please enter your license expiry date (MM/YYYY).';

  const [month, year] = expiry.split('/').map(Number);
  if (!month || !year || month < 1 || month > 12)
    return 'Enter a valid expiry date in MM/YYYY format.';

  const exp = new Date(year, month - 1, 1);
  if (exp < new Date()) return 'Your license appears to be expired.';

  return null;
};

// ── main screen ────────────────────────────────────────────────────────────
const DriverVerificationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  // For demo: cycle through statuses to preview all states
  // In production this comes from your API/store
  const [verificationStatus, setVerificationStatus] = useState('not_submitted');

  const [frontUri, setFrontUri] = useState(null);
  const [backUri, setBackUri] = useState(null);
  const [expiry, setExpiry] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isApproved = verificationStatus === 'approved';
  const isPending = verificationStatus === 'pending';
  const isLocked = isApproved || isPending;

  const pick = async (setter, source) => {
    try {
      const asset =
        source === 'camera' ? await openCamera() : await openGallery();
      if (asset?.uri) setter(asset.uri);
    } catch {
      Alert.alert(t('something_went_wrong'), 'Failed to pick image.');
    }
  };

  const handleSubmit = async () => {
    const error = validateLicense(frontUri, backUri, expiry);
    if (error) {
      Alert.alert('Incomplete', error);
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setVerificationStatus('pending');
      Alert.alert('Submitted!', t('submitted_message'));
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {/* header */}
      <CustomHeader
        title={t('driver_verification_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* status banner */}
        <StatusBanner status={verificationStatus} />

        {/* steps */}
        <View style={styles.stepsRow}>
          {[
            t('upload_drivers_license'),
            t('review_submit_title'),
            t('verified_chip'),
          ].map((s, i) => {
            const done =
              (i === 0 && (isPending || isApproved)) ||
              (i === 1 && isApproved) ||
              (i === 2 && isApproved);
            const active =
              (i === 0 && verificationStatus === 'not_submitted') ||
              (i === 1 && isPending) ||
              (i === 2 && isApproved);
            return (
              <React.Fragment key={s}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      done && styles.stepDotDone,
                      active && styles.stepDotActive,
                    ]}
                  >
                    {done ? (
                      <Icon
                        name="check"
                        size={moderateScale(12)}
                        color="#fff"
                      />
                    ) : (
                      <Text
                        style={[styles.stepNum, active && { color: '#fff' }]}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (done || active) && styles.stepLabelActive,
                    ]}
                  >
                    {s}
                  </Text>
                </View>
                {i < 2 && (
                  <View
                    style={[styles.stepLine, done && styles.stepLineDone]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* upload section */}
        <Text style={styles.sectionTitle}>{t('upload_drivers_license')}</Text>
        <Text style={styles.sectionSub}>{t('upload_license_desc')}</Text>

        <View style={styles.uploadRow}>
          <UploadCard
            label={t('front_side_label')}
            sublabel={t('front_side_sublabel')}
            uri={frontUri}
            onPickGallery={() => pick(setFrontUri, 'gallery')}
            onPickCamera={() => pick(setFrontUri, 'camera')}
          />
          <UploadCard
            label={t('back_side_label')}
            sublabel={t('back_side_sublabel')}
            uri={backUri}
            onPickGallery={() => pick(setBackUri, 'gallery')}
            onPickCamera={() => pick(setBackUri, 'camera')}
          />
        </View>

        {/* expiry date */}
        <Text style={styles.fieldLabel}>{t('license_expiry_date_label')}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.expiryRow,
            pressed && { opacity: 0.75 },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon
            name="calendar"
            size={moderateScale(16)}
            color={colors.textSecondary}
          />
          <Text
            style={[
              styles.expiryInput,
              !expiry && { color: colors.textDisabled },
            ]}
          >
            {expiry || t('expiry_format')}
          </Text>
        </Pressable>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          minimumDate={new Date()}
          onConfirm={date => {
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            setExpiry(`${mm}/${yyyy}`);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* requirements */}
        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>
            {t('requirements_section')}
          </Text>
          {[
            t('license_valid_requirement'),
            t('text_legible_requirement'),
            t('no_blurry_photos'),
            t('file_jpg_png'),
          ].map(r => (
            <View key={r} style={styles.requirementRow}>
              <Icon
                name="check-circle"
                size={moderateScale(14)}
                color={colors.success}
              />
              <Text style={styles.requirementText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* booking restriction notice */}
        {!isApproved && (
          <View style={styles.restrictionBox}>
            <Icon name="lock" size={moderateScale(16)} color={colors.warning} />
            <Text style={styles.restrictionText}>
              {t('booking_restricted')}
            </Text>
          </View>
        )}

        {/* submit */}
        {!isLocked && (
          <CustomButton
            title={submitting ? '' : t('submit_verification_button')}
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submitBtn}
            leftIcon={
              submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : undefined
            }
          />
        )}

        {isApproved && (
          <View style={styles.approvedFooter}>
            <Icon
              name="shield"
              size={moderateScale(20)}
              color={colors.success}
            />
            <Text style={styles.approvedText}>
              {t('verified_ready_to_book')}
            </Text>
          </View>
        )}

        {isPending && (
          <CustomButton
            title={t('resubmit_documents_button')}
            onPress={() => setVerificationStatus('not_submitted')}
            variant="outline"
            style={styles.submitBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverVerificationScreen;
