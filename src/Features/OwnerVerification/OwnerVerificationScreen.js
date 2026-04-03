import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, StatusBar, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../Theme/ThemeContext';
import {styles} from "./OwnerVerification.style"
const OwnerVerificationScreen = ({ navigation }) => {
  const colors = useColors();

  const { t } = useTranslation();

  const STEPS = [t('identity_verification_title'), t('ownership_declaration_title'), t('review_submit_title')];

  const STATUS_CONFIG = {
    not_submitted: { icon: 'radio-button-unchecked', color: '#9CA3AF', label: t('not_submitted_status') },
    pending: { icon: 'schedule', color: colors.warning, label: t('under_review_status') },
    approved: { icon: 'check-circle', color: colors.success, label: t('approved_status') },
    rejected: { icon: 'cancel', color: colors.error, label: t('rejected_status') },
  };

  const OWNER_TYPES = [t('individual_type'), t('contractor_type'), t('business_type')];

  const [currentStep, setCurrentStep] = useState(0);
  const [overallStatus, setOverallStatus] = useState('not_submitted');
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [ownerType, setOwnerType] = useState('Individual');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [regDocUploaded, setRegDocUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const simulateUpload = (setter, label) => {
    Alert.alert('Upload', `Simulating ${label} upload...`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upload', onPress: () => setter(true) },
    ]);
  };

  const handleSubmit = () => {
    if (!idFrontUploaded || !idBackUploaded) {
      Alert.alert('Missing Documents', 'Please upload both sides of your government ID.');
      return;
    }
    if (!declarationAccepted) {
      Alert.alert('Declaration Required', 'Please accept the ownership declaration.');
      return;
    }
    setSubmitted(true);
    setOverallStatus('pending');
  };

  const cfg = STATUS_CONFIG[overallStatus];

  if (submitted && overallStatus === 'pending') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.pendingContainer}>
          <Icon name="schedule" size={moderateScale(72)} color={colors.warning} />
          <Text style={styles.pendingTitle}>{t('under_review_title')}</Text>
          <Text style={styles.pendingSubtitle}>{t('under_review_subtitle')}</Text>
          <View style={styles.pendingCard}>
            <View style={styles.pendingRow}>
              <Icon name="badge" size={moderateScale(18)} color={colors.textSecondary} />
              <Text style={styles.pendingItemText}>{t('government_id_submitted')}</Text>
              <Icon name="check" size={moderateScale(16)} color={colors.success} />
            </View>
            <View style={styles.pendingRow}>
              <Icon name="assignment-turned-in" size={moderateScale(18)} color={colors.textSecondary} />
              <Text style={styles.pendingItemText}>{t('declaration_submitted')}</Text>
              <Icon name="check" size={moderateScale(16)} color={colors.success} />
            </View>
          </View>
          <TouchableOpacity style={styles.backBtn2} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn2Text}>{t('back_to_profile')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={moderateScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('owner_verification_title')}</Text>
      </View>

      {/* Status Banner */}
      {overallStatus !== 'not_submitted' && (
        <View style={[styles.statusBanner, { backgroundColor: cfg.color + '18' }]}>
          <Icon name={cfg.icon} size={moderateScale(18)} color={cfg.color} />
          <Text style={[styles.statusBannerText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      )}

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <TouchableOpacity style={styles.stepItem} onPress={() => setCurrentStep(i)}>
              <View style={[styles.stepCircle, i <= currentStep && styles.stepCircleActive, i < currentStep && styles.stepCircleDone]}>
                {i < currentStep ? (
                  <Icon name="check" size={moderateScale(14)} color="#fff" />
                ) : (
                  <Text style={[styles.stepNum, i <= currentStep && styles.stepNumActive]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i <= currentStep && styles.stepLabelActive]}>{step}</Text>
            </TouchableOpacity>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, i < currentStep && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Step 1: Identity */}
        {currentStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>{t('identity_verification_title')}</Text>
            <Text style={styles.stepSubtitle}>{t('identity_verification_desc')}</Text>

            {/* Owner Type */}
            <Text style={styles.fieldLabel}>{t('owner_type_label')}</Text>
            <View style={styles.ownerTypeRow}>
              {OWNER_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, ownerType === type && styles.typeChipActive]}
                  onPress={() => setOwnerType(type)}
                >
                  <Text style={[styles.typeChipText, ownerType === type && styles.typeChipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>{t('government_id_front')}</Text>
            <TouchableOpacity style={[styles.uploadBox, idFrontUploaded && styles.uploadBoxDone]} onPress={() => simulateUpload(setIdFrontUploaded, 'ID Front')}>
              <Icon name={idFrontUploaded ? 'check-circle' : 'add-photo-alternate'} size={moderateScale(32)} color={idFrontUploaded ? colors.success : '#9CA3AF'} />
              <Text style={[styles.uploadText, idFrontUploaded && { color: colors.success }]}>
                {idFrontUploaded ? t('id_front_uploaded') : t('tap_upload_id_front')}
              </Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>{t('government_id_back')}</Text>
            <TouchableOpacity style={[styles.uploadBox, idBackUploaded && styles.uploadBoxDone]} onPress={() => simulateUpload(setIdBackUploaded, 'ID Back')}>
              <Icon name={idBackUploaded ? 'check-circle' : 'add-photo-alternate'} size={moderateScale(32)} color={idBackUploaded ? colors.success : '#9CA3AF'} />
              <Text style={[styles.uploadText, idBackUploaded && { color: colors.success }]}>
                {idBackUploaded ? t('id_back_uploaded') : t('tap_upload_id_back')}
              </Text>
            </TouchableOpacity>

            <View style={styles.requirementsList}>
              {[t('clear_unobstructed_photo'), t('all_corners_visible'), t('not_expired'), t('file_size_limit')].map(req => (
                <View key={req} style={styles.requirementItem}>
                  <Icon name="check-circle-outline" size={moderateScale(14)} color={colors.success} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(1)}>
              <Text style={styles.nextBtnText}>{t('continue_button')}</Text>
              <Icon name="arrow-forward" size={moderateScale(16)} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Ownership */}
        {currentStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>{t('ownership_declaration_title')}</Text>
            <Text style={styles.stepSubtitle}>{t('ownership_declaration_subtitle')}</Text>

            <View style={styles.declarationCard}>
              <Text style={styles.declarationTitle}>Ownership Declaration</Text>
              <Text style={styles.declarationText}>
                I, the undersigned, hereby declare that I am the legal owner or authorized agent of all trailers I list on the Trailors platform. I confirm that:{'\n\n'}
                • All listed trailers are legally registered and roadworthy{'\n'}
                • I have the right to rent out the listed trailers{'\n'}
                • All information provided is accurate and truthful{'\n'}
                • I will comply with all platform policies and local regulations{'\n\n'}
                I understand that providing false information may result in account suspension.
              </Text>
              <TouchableOpacity style={styles.acceptRow} onPress={() => setDeclarationAccepted(!declarationAccepted)}>
                <View style={[styles.checkbox, declarationAccepted && styles.checkboxActive]}>
                  {declarationAccepted && <Icon name="check" size={moderateScale(14)} color="#fff" />}
                </View>
                <Text style={styles.acceptText}>I accept the ownership declaration and confirm all information is accurate</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>{t('trailer_registration_optional')}</Text>
            <TouchableOpacity style={[styles.uploadBox, regDocUploaded && styles.uploadBoxDone]} onPress={() => simulateUpload(setRegDocUploaded, 'Registration Document')}>
              <Icon name={regDocUploaded ? 'check-circle' : 'upload-file'} size={moderateScale(32)} color={regDocUploaded ? colors.success : '#9CA3AF'} />
              <Text style={[styles.uploadText, regDocUploaded && { color: colors.success }]}>
                {regDocUploaded ? t('document_uploaded') : t('tap_upload_registration')}
              </Text>
              <Text style={styles.uploadSubtext}>{t('file_format_hint')}</Text>
            </TouchableOpacity>

            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(0)}>
                <Icon name="arrow-back" size={moderateScale(16)} color={colors.primary} />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn2} onPress={() => setCurrentStep(2)}>
                <Text style={styles.nextBtnText}>Continue</Text>
                <Icon name="arrow-forward" size={moderateScale(16)} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Review */}
        {currentStep === 2 && (
          <View>
            <Text style={styles.stepTitle}>{t('review_submit_title')}</Text>
            <Text style={styles.stepSubtitle}>{t('review_submit_subtitle')}</Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Icon name="person" size={moderateScale(18)} color={colors.primary} />
                <Text style={styles.reviewLabel}>Owner Type</Text>
                <Text style={styles.reviewValue}>{ownerType}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="badge" size={moderateScale(18)} color={idFrontUploaded && idBackUploaded ? colors.success : colors.warning} />
                <Text style={styles.reviewLabel}>Government ID</Text>
                <Text style={[styles.reviewValue, { color: idFrontUploaded && idBackUploaded ? colors.success : colors.warning }]}>
                  {idFrontUploaded && idBackUploaded ? t('both_sides_uploaded') : t('incomplete_upload')}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Icon name="assignment-turned-in" size={moderateScale(18)} color={declarationAccepted ? colors.success : colors.warning} />
                <Text style={styles.reviewLabel}>Declaration</Text>
                <Text style={[styles.reviewValue, { color: declarationAccepted ? colors.success : colors.warning }]}>
                  {declarationAccepted ? t('declaration_accepted') : t('declaration_not_accepted')}
                </Text>
              </View>
              <View style={[styles.reviewRow, { borderBottomWidth: 0 }]}>
                <Icon name="description" size={moderateScale(18)} color={colors.textSecondary} />
                <Text style={styles.reviewLabel}>Reg. Documents</Text>
                <Text style={styles.reviewValue}>{regDocUploaded ? t('registration_uploaded') : t('registration_not_uploaded')}</Text>
              </View>
            </View>

            <View style={styles.reviewNote}>
              <Icon name="info-outline" size={moderateScale(14)} color={colors.primary} />
              <Text style={styles.reviewNoteText}>
                {t('review_note')}
              </Text>
            </View>

            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(1)}>
                <Icon name="arrow-back" size={moderateScale(16)} color={colors.primary} />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Icon name="send" size={moderateScale(16)} color="#fff" />
                <Text style={styles.nextBtnText}>{t('submit_for_review_button')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: moderateScale(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};



export default OwnerVerificationScreen;
