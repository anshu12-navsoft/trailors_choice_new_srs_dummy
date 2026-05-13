import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';
import CustomButton from '../../../Components/Buttons/CustomButton';

// ─── REDUX WIRING (uncomment when backend is ready) ──────────────────────────
// import { useSelector } from 'react-redux';
// import { registerUser } from '../../../App/Redux/Slices/registerSlice';
// ─────────────────────────────────────────────────────────────────────────────

const UploadBox = ({ label, uri, onPress }) => (
  <View style={styles.uploadSection}>
    <Text style={styles.uploadSectionLabel}>{label}</Text>
    <Pressable style={styles.uploadBox} onPress={onPress}>
      {uri ? (
        <Text style={styles.uploadedText} numberOfLines={1}>
          {uri.split('/').pop()}
        </Text>
      ) : (
        <View style={styles.uploadPlaceholder}>
          <Icon name="image-plus" size={moderateScale(22)} color="#3B5BDB" />
          <Text style={styles.uploadLabel}>
            {label.includes('Driving') ? 'Upload Driving License'
              : label.includes('Government') ? 'Upload Government ID'
              : 'Upload Trailer Document'}
          </Text>
        </View>
      )}
    </Pressable>
  </View>
);

const VerificationScreen = ({ navigation, route }) => {
  const { role, phoneNumber } = route.params || {};
  const isOwner = role === 'owner';

  const dispatch = useDispatch();

  const [idDoc, setIdDoc]         = useState(null);
  const [trailerDoc, setTrailerDoc] = useState(null);
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [loading, setLoading]     = useState(false);

  // ── REDUX HOOKS (uncomment when backend is ready) ─────────────────────────
  // const { loading: regLoading } = useSelector(state => state.register);
  // ─────────────────────────────────────────────────────────────────────────

  const handleUpload = setter => {
    // TODO: wire react-native-image-picker or react-native-document-picker
    Alert.alert('Upload', 'Image/document picker not wired yet.');
  };

  const handleSave = async () => {
    if (!idDoc) {
      Alert.alert('Required', isOwner ? 'Please upload a Government ID.' : 'Please upload your Driving License.');
      return;
    }
    if (!trailerDoc) {
      Alert.alert('Required', 'Please upload the Trailer Document.');
      return;
    }
    if (isOwner && !legalConfirmed) {
      Alert.alert('Required', 'Please confirm your legal rights to lease.');
      return;
    }

    // ── CURRENT FLOW (local AsyncStorage, no backend) ─────────────────────
    try {
      setLoading(true);
      await AsyncStorage.setItem(`USER_${phoneNumber}`, 'registered');
      dispatch(loginSuccess());
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    // ─────────────────────────────────────────────────────────────────────

    // ── REDUX FLOW (uncomment when backend is ready, remove block above) ──
    // const formData = new FormData();
    // formData.append('phone', phoneNumber);
    // formData.append('idDocument', { uri: idDoc, name: 'id_doc.jpg', type: 'image/jpeg' });
    // formData.append('trailerDocument', { uri: trailerDoc, name: 'trailer_doc.jpg', type: 'image/jpeg' });
    // if (isOwner) formData.append('legalConfirmed', legalConfirmed);
    // const result = await dispatch(registerUser(formData));
    // if (registerUser.fulfilled.match(result)) {
    //   dispatch(loginSuccess());
    // } else {
    //   Alert.alert('Error', result.payload || 'Verification failed.');
    // }
    // ─────────────────────────────────────────────────────────────────────
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            {isOwner ? 'Owner Verification' : 'Renter Verification'}
          </Text>

          <UploadBox
            label={isOwner ? 'Verify Identity' : 'Verify Identity'}
            uri={idDoc}
            onPress={() => handleUpload(setIdDoc)}
          />

          <UploadBox
            label="Trailer Ownership/ Registration Document"
            uri={trailerDoc}
            onPress={() => handleUpload(setTrailerDoc)}
          />

          {isOwner && (
            <Pressable
              style={styles.checkRow}
              onPress={() => setLegalConfirmed(v => !v)}
            >
              <View style={[styles.checkbox, legalConfirmed && styles.checkboxChecked]}>
                {legalConfirmed && (
                  <Icon name="check" size={moderateScale(13)} color="#fff" />
                )}
              </View>
              <Text style={styles.checkLabel}>
                As owner I confirm the legal rights to lease
              </Text>
            </Pressable>
          )}

          <CustomButton
            title={loading ? 'Saving…' : 'Save and Continue'}
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={loading}
            style={styles.continueBtn}
            // loading={regLoading}   // ← uncomment with Redux flow
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  flex:    { flex: 1 },

  backBtn: {
    marginTop: moderateScale(12),
    marginLeft: moderateScale(20),
    alignSelf: 'flex-start',
  },

  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(40),
  },

  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#111827',
    marginBottom: moderateScale(28),
  },

  uploadSection: {
    marginBottom: moderateScale(24),
  },

  uploadSectionLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#111827',
    marginBottom: moderateScale(10),
  },

  uploadBox: {
    borderRadius: moderateScale(10),
    backgroundColor: '#EEF2FF',
    height: moderateScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadPlaceholder: {
    alignItems: 'center',
    gap: moderateScale(8),
  },

  uploadLabel: {
    fontSize: moderateScale(13),
    color: '#3B5BDB',
    fontWeight: '500',
  },

  uploadedText: {
    fontSize: moderateScale(13),
    color: '#374151',
    paddingHorizontal: moderateScale(16),
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: moderateScale(32),
  },

  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  checkLabel: {
    fontSize: moderateScale(13),
    color: '#374151',
    flex: 1,
  },

  continueBtn: {
    marginTop: moderateScale(8),
  },
});

export default VerificationScreen;