import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../Components/Buttons/CustomButton';
import {styles} from "./Register.styles"

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const formatDob = date => {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d} - ${m} - ${y}`;
};

/* ── Reusable field wrapper ── */
const Field = ({ label, children }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const Register = ({ navigation, route }) => {
  const { phoneNumber } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [dob, setDob]             = useState(null);
  const [showDate, setShowDate]   = useState(false);
  const [phone, setPhone]         = useState(phoneNumber || '');
  const [address, setAddress]     = useState('');
  const [city, setCity]           = useState('');
  const [state, setState]         = useState('');
  const [zipcode, setZipcode]     = useState('');
  const [showState, setShowState] = useState(false);

  const handleContinue = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!dob) {
      Alert.alert('Required', 'Please select your date of birth.');
      return;
    }
    try {
      await AsyncStorage.setItem(`USER_${phoneNumber}`, 'registered');
      await AsyncStorage.setItem('LAST_USER_ID', 'user_123');
      navigation.navigate('AccountSettings');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create account</Text>

          {/* Legal Name */}
          <Field label="Legal Name">
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="First Name"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Last Name"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </Field>

          {/* Date of Birth */}
          <Field label="Date of Birth">
            <Pressable style={styles.iconInput} onPress={() => setShowDate(true)}>
              <Text style={[styles.inputText, !dob && styles.placeholder]}>
                {dob ? formatDob(dob) : 'DD - MM - YYYY'}
              </Text>
              <Icon name="calendar-month-outline" size={moderateScale(20)} color="#6B7280" />
            </Pressable>
          </Field>

          {showDate && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_, selected) => {
                setShowDate(false);
                if (selected) setDob(selected);
              }}
            />
          )}

          {/* Phone Number */}
          <Field label="Phone Number">
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </Field>

          {/* Address */}
          <Field label="Address">
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />
          </Field>

          {/* City */}
          <Field label="City">
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#9CA3AF"
              value={city}
              onChangeText={setCity}
            />
          </Field>

          {/* State + Zipcode */}
          <View style={styles.row}>
            <View style={[styles.fieldHalf]}>
              <Text style={styles.label}>State</Text>
              <Pressable style={[styles.iconInput, styles.halfInput]} onPress={() => setShowState(true)}>
                <Text style={[styles.inputText, !state && styles.placeholder]}>
                  {state || 'State'}
                </Text>
                <Icon name="chevron-down" size={moderateScale(18)} color="#6B7280" />
              </Pressable>
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Zipcode</Text>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Zipcode"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={zipcode}
                onChangeText={setZipcode}
              />
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By clicking <Text style={styles.termsBold}>Agree and Continue</Text>, I agree to the terms
            of service and privacy policy
          </Text>

          <CustomButton
            title="Agree and Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State picker modal */}
      <Modal visible={showState} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowState(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select State</Text>
          <FlatList
            data={US_STATES}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.stateItem}
                onPress={() => { setState(item); setShowState(false); }}
              >
                <Text style={[styles.stateItemText, state === item && styles.stateItemActive]}>
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Register;


