import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';
import { saveDocuments } from '../../../App/Redux/Slices/registerSlice';
import {
  openCamera,
  openGallery,
  openDocumentPicker,
  isDocumentPickerCancel,
} from '../../../utils/helpers/mediaPicker.helper';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/AccountSettings.styles';

// Document slot definitions per role — add more entries here to extend
const RENTER_DOC_TYPES = [
  { document_type: 'driving_license',  label: 'Driving License' },
  { document_type: 'trailer_document', label: 'Trailer Document' },
];

const OWNER_DOC_TYPES = [
  { document_type: 'government_id',    label: 'Government ID' },
  { document_type: 'trailer_document', label: 'Trailer Document' },
];

const AccountSettings = ({ route, navigation }) => {
  const { role: routeRole } = route.params || {};
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.register);

  const [role, setRole] = useState(routeRole ?? null);

  // When arriving from OTP flow, role is not in params — read from AsyncStorage
  useEffect(() => {
    if (!routeRole) {
      AsyncStorage.getItem('USER_ROLE').then(stored => {
        if (stored) setRole(stored);
      });
    }
  }, [routeRole]);

  const docTypes = role === 'owner' ? OWNER_DOC_TYPES : RENTER_DOC_TYPES;

  // documents[i].file = { uri, type, fileName } | null
  const [documents, setDocuments] = useState(docTypes.map(() => ({ file: null })));
  const [isDeclared, setIsDeclared] = useState(false);

  const pickFile = (index) => {
    Alert.alert('Upload Document', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          try {
            const asset = await openCamera();
            if (asset) updateDoc(index, asset);
          } catch (err) {
            Alert.alert('Error', err?.message || 'Could not open camera.');
          }
        },
      },
      {
        text: 'Choose Photo from Gallery',
        onPress: async () => {
          try {
            const asset = await openGallery();
            if (asset) updateDoc(index, asset);
          } catch (err) {
            Alert.alert('Error', err?.message || 'Could not open gallery.');
          }
        },
      },
      {
        text: 'Browse Files / PDF',
        onPress: async () => {
          try {
            const asset = await openDocumentPicker();
            if (asset) updateDoc(index, asset);
          } catch (err) {
            if (!isDocumentPickerCancel(err)) {
              Alert.alert('Error', err?.message || 'Could not open file picker.');
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const updateDoc = (index, asset) => {
    setDocuments(prev => {
      const next = [...prev];
      next[index] = { file: asset };
      return next;
    });
  };

  const handleSkip = () => {
    dispatch(loginSuccess());
  };

  const handleSave = () => {
    if (!isDeclared) {
      Alert.alert('Declaration Required', 'Please accept the declaration to continue.');
      return;
    }

    const fd = new FormData();
    fd.append('is_declared', 'true');

    console.log('=== AccountSettings → handleSave ===');
    console.log('role:', role);
    console.log('isDeclared:', isDeclared);
    console.log('documents state:', JSON.stringify(
      documents.map((d, i) => ({
        index: i,
        document_type: docTypes[i]?.document_type,
        hasFile: !!d.file,
        uri: d.file?.uri,
        type: d.file?.type,
        fileName: d.file?.fileName,
      })),
      null,
      2,
    ));

    documents.forEach((doc, i) => {
      if (doc.file?.uri) {
        const ext = doc.file.uri.split('.').pop()?.split('?')[0] || 'jpg';
        const fileEntry = {
          uri: doc.file.uri,
          type: doc.file.type || 'image/jpeg',
          name: doc.file.fileName || `document_${i}.${ext}`,
        };
        console.log(`Appending documents[${i}][file]:`, JSON.stringify(fileEntry));
        console.log(`Appending documents[${i}][document_type]:`, docTypes[i].document_type);
        fd.append(`documents[${i}][file]`, fileEntry);
        fd.append(`documents[${i}][document_type]`, docTypes[i].document_type);
      } else {
        console.log(`documents[${i}] skipped — no file selected`);
      }
    });

    console.log('FormData _parts:', JSON.stringify(fd._parts, null, 2));
    console.log('Dispatching saveDocuments...');

    dispatch(saveDocuments(fd)).then(result => {
      if (saveDocuments.fulfilled.match(result)) {
        dispatch(loginSuccess());
      } else {
        Alert.alert('Error', result.payload || 'Failed to save documents.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
          </Pressable>
          <Pressable onPress={handleSkip} hitSlop={10} disabled={loading}>
            <Text style={styles.skip}>SKIP</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Account Settings</Text>

          {docTypes.map((docDef, index) => (
            <View key={docDef.document_type}>
              <Text style={styles.sectionLabel}>{docDef.label}</Text>
              <Pressable style={styles.uploadBox} onPress={() => pickFile(index)}>
                {documents[index]?.file?.uri ? (
                  <Image
                    source={{ uri: documents[index].file.uri }}
                    style={styles.uploadedImage}
                  />
                ) : (
                  <View style={styles.uploadInner}>
                    <Icon name="file-upload-outline" size={moderateScale(24)} color="#9CA3AF" />
                    <Text style={styles.uploadPlaceholder}>Upload {docDef.label}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          ))}

          {/* Declaration */}
          <Pressable style={styles.declareRow} onPress={() => setIsDeclared(v => !v)}>
            <View style={[styles.checkbox, isDeclared && styles.checkboxActive]}>
              {isDeclared && (
                <Icon name="check" size={moderateScale(13)} color="#fff" />
              )}
            </View>
            <Text style={styles.declareText}>
              I declare that all information and documents provided are accurate and genuine.
            </Text>
          </Pressable>

          <CustomButton
            title="Save and Continue"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveBtn}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountSettings;
