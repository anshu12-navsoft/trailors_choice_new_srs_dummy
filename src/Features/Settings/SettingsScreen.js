import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {
  isBiometricSupported,
  getBiometricType,
  enableBiometrics,
  isBiometricEnabled,
} from '../../Services/biometrics.service';
import Fonts from '../../Theme/Fonts';
import { useTranslation } from 'react-i18next';
import i18n from '../../Services/bilingual_il8n/index';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../App/Redux/Slices/themeSlice';
import { useColors } from '../../Theme/ThemeContext';
import { styles } from './Settings.style';
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
];

// TODO: replace with useSelector(state => state.auth.userId) once API is wired
const USER_ID = 'user_123';

// ── reusable sub-components (each reads colors from context) ─────────────────
const SettingRow = ({ icon, label, sublabel, right, onPress, danger }) => {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.rowPressed,
      ]}
      disabled={!onPress}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <Icon
          name={icon}
          size={moderateScale(18)}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, danger && { color: colors.error }]}>
          {label}
        </Text>
        {sublabel ? <Text style={styles.rowSub}>{sublabel}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
};

const SectionHeader = ({ title }) => {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Text style={styles.sectionHeader}>{title}</Text>;
};

const Divider = () => {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.divider} />;
};

// ── main ────────────────────────────────────────────────────────────────────
const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = useColors();

  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [enablingBiometric, setEnablingBiometric] = useState(false);

  const [currentLang, setCurrentLang] = useState(
    i18n.language?.startsWith('es') ? 'es' : 'en',
  );
  const [langModalVisible, setLangModalVisible] = useState(false);

  const handleSelectLanguage = code => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
    setLangModalVisible(false);
  };

  const currentLangLabel =
    LANGUAGES.find(l => l.code === currentLang)?.label ?? 'English';

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const supported = await isBiometricSupported();
  //     setBiometricSupported(supported);
  //     const type = await getBiometricType();
  //     setBiometricType(type ?? '');
  //     const enabled = await isBiometricEnabled(USER_ID);
  //     setBiometricEnabled(enabled);
  //   })();
  // }, []);

  // const handleToggleBiometric = async (value) => {
  //   if (!value) {
  //     setBiometricEnabled(false);
  //     Alert.alert(t('biometrics_disabled'), t('biometrics_disabled_message'));
  //     return;
  //   }
  //   try {
  //     setEnablingBiometric(true);
  //     const apiSendPublicKey = async (uid, key) => {
  //       console.log('Public key for server:', uid, key);
  //     };
  //     await enableBiometrics(USER_ID, apiSendPublicKey);
  //     setBiometricEnabled(true);
  //     Alert.alert(t('biometrics_enabled_title'), t('biometrics_enabled_message'));
  //   } catch (e) {
  //     Alert.alert(t('profile_save_error'), e.message);
  //   } finally {
  //     setEnablingBiometric(false);
  //   }
  // };

  // const biometricLabel =
  //   biometricType === 'FaceID'
  //     ? t('biometric_login')
  //     : biometricType === 'TouchID'
  //     ? t('biometric_login_touch')
  //     : t('biometric_login_generic');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Icon
            name="arrow-left"
            size={moderateScale(22)}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings_title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Security ── */}
        <SectionHeader title={t('security_section')} />
        <View style={styles.card}>
          {/* {biometricSupported && (
            <SettingRow
              icon="shield"
              label={biometricLabel}
              sublabel={biometricEnabled ? t('biometric_enabled') : t('biometric_enable_prompt')}
              right={
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleToggleBiometric}
                  disabled={enablingBiometric}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              }
            />
          )} */}
          {/* {!biometricSupported && (
            <SettingRow
              icon="shield-off"
              label={t('biometric_login_generic')}
              sublabel={t('biometric_not_available')}
              right={<Switch value={false} disabled trackColor={{ false: colors.border }} thumbColor="#fff" />}
            />
          )} */}
          {/* <Divider /> */}
          <SettingRow
            icon="lock"
            label={t('change_password')}
            sublabel={t('update_password')}
            onPress={() => Alert.alert(t('coming_soon'))}
            right={
              <Icon
                name="chevron-right"
                size={moderateScale(18)}
                color={colors.textDisabled}
              />
            }
          />
          <Divider />
          <SettingRow
            icon="smartphone"
            label={t('two_factor_auth')}
            sublabel={t('add_security_layer')}
            onPress={() => Alert.alert(t('coming_soon'))}
            right={
              <Icon
                name="chevron-right"
                size={moderateScale(18)}
                color={colors.textDisabled}
              />
            }
          />
        </View>

        {/* ── Notifications ── */}
        <SectionHeader title={t('notifications_section')} />
        <View style={styles.card}>
          <SettingRow
            icon="bell"
            label={t('push_notifications')}
            sublabel={t('push_notifications_desc')}
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <Divider />
          <SettingRow
            icon="mail"
            label={t('email_notifications')}
            sublabel={t('email_notifications_desc')}
            right={
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <Divider />
          <SettingRow
            icon="message-square"
            label={t('sms_notifications')}
            sublabel={t('sms_notifications_desc')}
            right={
              <Switch
                value={smsEnabled}
                onValueChange={setSmsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* ── App ── */}
        <SectionHeader title={t('app_section')} />
        <View style={styles.card}>
          <SettingRow
            icon="globe"
            label={t('language_label')}
            sublabel={currentLangLabel}
            onPress={() => setLangModalVisible(true)}
            right={
              <Icon
                name="chevron-right"
                size={moderateScale(18)}
                color={colors.textDisabled}
              />
            }
          />
          <Divider />
          <SettingRow
            icon="moon"
            label={t('dark_mode_label')}
            sublabel={isDark ? t('dark_mode_on') : t('dark_mode_off')}
            right={
              <Switch
                value={isDark}
                onValueChange={() => dispatch(toggleTheme())}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* ── Danger zone ── */}
        <SectionHeader title={t('account_section')} />
        <View style={styles.card}>
          <SettingRow
            icon="trash-2"
            label={t('delete_account')}
            sublabel={t('delete_account_desc')}
            danger
            onPress={() =>
              Alert.alert(
                t('delete_account_title'),
                t('delete_account_message'),
                [
                  { text: t('cancel_button'), style: 'cancel' },
                  {
                    text: t('delete_account'),
                    style: 'destructive',
                    onPress: () => {},
                  },
                ],
              )
            }
          />
        </View>

        <Text style={styles.version}>Trailors v1.0.0</Text>
      </ScrollView>

      {/* Language picker modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('select_language')}</Text>
            {LANGUAGES.map((lang, idx) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  idx < LANGUAGES.length - 1 && styles.langOptionBorder,
                ]}
                onPress={() => handleSelectLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.langOptionLeft}>
                  <Text style={styles.langLabel}>{lang.label}</Text>
                  <Text style={styles.langNative}>{lang.native}</Text>
                </View>
                {currentLang === lang.code && (
                  <Icon
                    name="check"
                    size={moderateScale(18)}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
