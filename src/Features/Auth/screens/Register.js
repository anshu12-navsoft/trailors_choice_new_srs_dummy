import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/Register.styles';
import { registerUser } from '../../../App/Redux/Slices/registerSlice';
import { fetchStates } from '../../../App/Redux/Slices/stateSlice';
import { fetchCities } from '../../../App/Redux/Slices/citySlice';

const OWNER_TYPES = ['Business', 'Individual'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIPCODE_REGEX = /^\d+$/;

const Field = ({ label, children }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

/* ── Renter Form ── */
const RenterForm = ({ form, setForm, onStatePress, onCityPress }) => (
  <>
    <Field label="Your Name">
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#9CA3AF"
          value={form.firstName}
          onChangeText={v => setForm(f => ({ ...f, firstName: v }))}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#9CA3AF"
          value={form.lastName}
          onChangeText={v => setForm(f => ({ ...f, lastName: v }))}
        />
      </View>
    </Field>

    <Field label="Email">
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={v => setForm(f => ({ ...f, email: v }))}
      />
    </Field>

    <Field label="Address">
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#9CA3AF"
        value={form.address}
        onChangeText={v => setForm(f => ({ ...f, address: v }))}
      />
    </Field>

    <View style={[styles.row, { marginBottom: moderateScale(16) }]}>
      <View style={styles.fieldHalf}>
        <Text style={styles.label}>State</Text>
        <Pressable
          style={[styles.iconInput, styles.halfInput]}
          onPress={onStatePress}
        >
          <Text style={[styles.inputText, !form.state && styles.placeholder]}>
            {form.state || 'State'}
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
          value={form.zipcode}
          onChangeText={v => setForm(f => ({ ...f, zipcode: v }))}
        />
      </View>
    </View>

    <Field label="City">
      <Pressable
        style={[styles.iconInput, !form.stateCode && { opacity: 0.5 }]}
        onPress={form.stateCode ? onCityPress : undefined}
      >
        <Text style={[styles.inputText, !form.city && styles.placeholder]}>
          {form.city || (form.stateCode ? 'Select city' : 'Select state first')}
        </Text>
        <Icon name="chevron-down" size={moderateScale(18)} color="#6B7280" />
      </Pressable>
    </Field>
  </>
);

/* ── Owner Form ── */
const OwnerForm = ({
  form,
  setForm,
  onStatePress,
  onCityPress,
  onOwnerTypePress,
  onLogoPress,
}) => (
  <>
    <Field label="Your Name">
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#9CA3AF"
          value={form.firstName}
          onChangeText={v => setForm(f => ({ ...f, firstName: v }))}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          placeholderTextColor="#9CA3AF"
          value={form.lastName}
          onChangeText={v => setForm(f => ({ ...f, lastName: v }))}
        />
      </View>
    </Field>

    <Field label="Email">
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={v => setForm(f => ({ ...f, email: v }))}
      />
    </Field>

    <Field label="Owner Type">
      <Pressable style={styles.iconInput} onPress={onOwnerTypePress}>
        <Text style={[styles.inputText, !form.ownerType && styles.placeholder]}>
          {form.ownerType || 'Select type'}
        </Text>
        <Icon name="chevron-down" size={moderateScale(18)} color="#6B7280" />
      </Pressable>
    </Field>

    {form.ownerType === 'Business' && (
      <Field label="Business Name">
        <TextInput
          style={styles.input}
          placeholder="Business name"
          placeholderTextColor="#9CA3AF"
          value={form.businessName}
          onChangeText={v => setForm(f => ({ ...f, businessName: v }))}
        />
      </Field>
    )}

    <Field label="Business Address">
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#9CA3AF"
        value={form.address}
        onChangeText={v => setForm(f => ({ ...f, address: v }))}
      />
    </Field>

    <View style={[styles.row, { marginBottom: moderateScale(16) }]}>
      <View style={styles.fieldHalf}>
        <Text style={styles.label}>State</Text>
        <Pressable
          style={[styles.iconInput, styles.halfInput]}
          onPress={onStatePress}
        >
          <Text style={[styles.inputText, !form.state && styles.placeholder]}>
            {form.state || 'State'}
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
          value={form.zipcode}
          onChangeText={v => setForm(f => ({ ...f, zipcode: v }))}
        />
      </View>
    </View>

    <Field label="City">
      <Pressable
        style={[styles.iconInput, !form.stateCode && { opacity: 0.5 }]}
        onPress={form.stateCode ? onCityPress : undefined}
      >
        <Text style={[styles.inputText, !form.city && styles.placeholder]}>
          {form.city || (form.stateCode ? 'Select city' : 'Select state first')}
        </Text>
        <Icon name="chevron-down" size={moderateScale(18)} color="#6B7280" />
      </Pressable>
    </Field>

    <Field label="Company Logo">
      <Pressable style={styles.uploadBox} onPress={onLogoPress}>
        {form.logoUri ? (
          <Text style={styles.uploadedText} numberOfLines={1}>
            {form.logoUri.split('/').pop()}
          </Text>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Icon name="image-plus" size={moderateScale(22)} color="#3B5BDB" />
            <Text style={styles.uploadLabel}>Upload logo</Text>
          </View>
        )}
      </Pressable>
    </Field>
  </>
);

/* ── Main Screen ── */
const Register = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.register);
  const { states } = useSelector(state => state.state);
  const { cities, loading: citiesLoading } = useSelector(state => state.city);

  const [activeTab, setActiveTab] = useState('renter');

  const defaultForm = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',      // display name
    stateCode: '', // code sent to API, e.g. "US-NY"
    zipcode: '',
  };

  const [renterForm, setRenterForm] = useState({ ...defaultForm });
  const [ownerForm, setOwnerForm] = useState({
    ...defaultForm,
    ownerType: 'Business',
    businessName: '',
    logoUri: null,
  });

  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showOwnerTypePicker, setShowOwnerTypePicker] = useState(false);

  const currentForm = activeTab === 'renter' ? renterForm : ownerForm;
  const setCurrentForm = activeTab === 'renter' ? setRenterForm : setOwnerForm;

  useEffect(() => {
    dispatch(fetchStates());
  }, []);

  const handleStateSelect = (item) => {
    setCurrentForm(f => ({ ...f, state: item.name, stateCode: item.code, city: '' }));
    dispatch(fetchCities(item.code));
    setShowStatePicker(false);
  };

  const handleContinue = () => {
    const { firstName, lastName, email, address, city, stateCode, zipcode } =
      currentForm;

    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required', 'Please enter your last name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address (e.g. user@example.com).',
      );
      return;
    }
    if (!address.trim()) {
      Alert.alert('Required', 'Please enter your address.');
      return;
    }
    if (!stateCode) {
      Alert.alert('Required', 'Please select your state.');
      return;
    }
    if (!zipcode.trim()) {
      Alert.alert('Required', 'Please enter your postal code.');
      return;
    }
    if (!ZIPCODE_REGEX.test(zipcode.trim())) {
      Alert.alert(
        'Invalid Postal Code',
        'Postal code must contain numbers only.',
      );
      return;
    }
    if (!city) {
      Alert.alert('Required', 'Please select your city.');
      return;
    }
    if (
      activeTab === 'owner' &&
      currentForm.ownerType === 'Business' &&
      !currentForm.businessName?.trim()
    ) {
      Alert.alert('Required', 'Please enter your business name.');
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      address_line1: address.trim(),
      city,
      state: stateCode,
      postal_code: zipcode.trim(),
      role: activeTab,
    };

    dispatch(registerUser({ userId, payload })).then(async result => {
      if (registerUser.fulfilled.match(result)) {
        await AsyncStorage.setItem('USER_ROLE', activeTab);
        const verification_url = result.payload?.verification_url;
        if (verification_url) {
          navigation.navigate('VerificationWebView', { verification_url });
        } else {
          navigation.navigate('AccountSettings', { role: activeTab, userId });
        }
      } else {
        Alert.alert(
          'Registration Failed',
          result.payload || 'Something went wrong. Please try again.',
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create account</Text>

          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, activeTab === 'renter' && styles.tabActive]}
              onPress={() => setActiveTab('renter')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'renter' && styles.tabTextActive,
                ]}
              >
                I'm a Renter
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'owner' && styles.tabActive]}
              onPress={() => setActiveTab('owner')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'owner' && styles.tabTextActive,
                ]}
              >
                I'm an Owner
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          {activeTab === 'renter' ? (
            <RenterForm
              form={renterForm}
              setForm={setRenterForm}
              onStatePress={() => setShowStatePicker(true)}
              onCityPress={() => setShowCityPicker(true)}
            />
          ) : (
            <OwnerForm
              form={ownerForm}
              setForm={setOwnerForm}
              onStatePress={() => setShowStatePicker(true)}
              onCityPress={() => setShowCityPicker(true)}
              onOwnerTypePress={() => setShowOwnerTypePicker(true)}
              onLogoPress={() => {
                Alert.alert('Upload', 'Image picker not wired yet.');
              }}
            />
          )}

          {/* Terms */}
          <Text style={styles.terms}>
            By clicking <Text style={styles.termsBold}>Agree and Continue</Text>
            , I agree to the terms of service and privacy policy
          </Text>

          <CustomButton
            title="Agree and Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueBtn}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State picker modal */}
      <Modal visible={showStatePicker} animationType="slide" transparent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowStatePicker(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select State</Text>
          <FlatList
            data={states}
            keyExtractor={item => item.id?.toString() ?? item.name}
            renderItem={({ item }) => (
              <Pressable
                style={styles.stateItem}
                onPress={() => handleStateSelect(item)}
              >
                <Text
                  style={[
                    styles.stateItemText,
                    currentForm.state === item.name && styles.stateItemActive,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {/* City picker modal */}
      <Modal visible={showCityPicker} animationType="slide" transparent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCityPicker(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select City</Text>
          {citiesLoading ? (
            <ActivityIndicator
              style={{ padding: moderateScale(24) }}
              color="#3B5BDB"
            />
          ) : (
            <FlatList
              data={cities}
              keyExtractor={item => item.id?.toString() ?? item.name}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.stateItem}
                  onPress={() => {
                    setCurrentForm(f => ({ ...f, city: item.name }));
                    setShowCityPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.stateItemText,
                      currentForm.city === item.name && styles.stateItemActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </Modal>

      {/* Owner type picker modal */}
      <Modal visible={showOwnerTypePicker} animationType="slide" transparent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOwnerTypePicker(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Owner Type</Text>
          {OWNER_TYPES.map(item => (
            <Pressable
              key={item}
              style={styles.stateItem}
              onPress={() => {
                setOwnerForm(f => ({ ...f, ownerType: item }));
                setShowOwnerTypePicker(false);
              }}
            >
              <Text
                style={[
                  styles.stateItemText,
                  ownerForm.ownerType === item && styles.stateItemActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Register;
