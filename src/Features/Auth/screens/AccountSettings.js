import React, { useState } from 'react';
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
import { styles } from '../stylesheets/AccountSettings.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';
import { openCamera, openGallery } from '../../../utils/helpers/mediaPicker.helper';
import CustomButton from '../../../Components/Buttons/CustomButton';

const AccountSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selfie, setSelfie] = useState(null);
  const [license, setLicense] = useState(null);
  const [about, setAbout] = useState('');

  const pickSelfie = () => {
    Alert.alert('Verify Identity', 'Choose a source', [
      {
        text: 'Take Selfie',
        onPress: async () => {
          try {
            const asset = await openCamera();
            if (asset) setSelfie(asset);
          } catch {
            Alert.alert('Error', 'Could not open camera.');
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          try {
            const asset = await openGallery();
            if (asset) setSelfie(asset);
          } catch {
            Alert.alert('Error', 'Could not open gallery.');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickLicense = () => {
    Alert.alert('Driving License', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          try {
            const asset = await openCamera();
            if (asset) setLicense(asset);
          } catch {
            Alert.alert('Error', 'Could not open camera.');
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          try {
            const asset = await openGallery();
            if (asset) setLicense(asset);
          } catch {
            Alert.alert('Error', 'Could not open gallery.');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    dispatch(loginSuccess());
  };

  const handleSkip = () => {
    dispatch(loginSuccess());
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
          </Pressable>
          <Pressable onPress={handleSkip} hitSlop={10}>
            <Text style={styles.skip}>SKIP</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Account Settings</Text>

          {/* Verify Identity */}
          <Text style={styles.sectionLabel}>Verify Identity</Text>
          <Pressable style={styles.uploadBox} onPress={pickSelfie}>
            {selfie?.uri ? (
              <Image source={{ uri: selfie.uri }} style={styles.uploadedImage} />
            ) : (
              <Text style={styles.uploadPlaceholder}>Take a selfie of yourself</Text>
            )}
          </Pressable>

          {/* Verify Driving License */}
          <Text style={styles.sectionLabel}>Verify Driving License</Text>
          <Pressable style={styles.uploadBox} onPress={pickLicense}>
            {license?.uri ? (
              <Image source={{ uri: license.uri }} style={styles.uploadedImage} />
            ) : (
              <Text style={styles.uploadPlaceholder}>Upload Driving License</Text>
            )}
          </Pressable>

          {/* About Yourself */}
          <Text style={styles.sectionLabel}>About Yourself</Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            placeholder="Share something special about the trailer"
            placeholderTextColor="#9CA3AF"
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.textArea}
            outlineStyle={styles.textAreaOutline}
            contentStyle={styles.textAreaContent}
          />

          <CustomButton
            title="Save and Continue"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveBtn}
          />
        </ScrollView>1
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountSettings;
