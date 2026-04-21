import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { styles } from '../stylesheets/Register.styles';

// ─── REDUX WIRING (uncomment when backend is ready) ──────────────────────────
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../../../App/Redux/Slices/registerSlice';
// ─────────────────────────────────────────────────────────────────────────────

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

const OWNER_TYPES = ['Business', 'Individual'];

const Field = ({ label, children }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

/* ── Renter Form ── */
const RenterForm = ({ form, setForm, onStatePress }) => (
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

    <Field label="City">
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#9CA3AF"
        value={form.city}
        onChangeText={v => setForm(f => ({ ...f, city: v }))}
      />
    </Field>

    <View style={styles.row}>
      <View style={styles.fieldHalf}>
        <Text style={styles.label}>State</Text>
        <Pressable style={[styles.iconInput, styles.halfInput]} onPress={onStatePress}>
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
  </>
);

/* ── Owner Form ── */
const OwnerForm = ({ form, setForm, onStatePress, onOwnerTypePress, onLogoPress }) => (
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

    <Field label="City">
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#9CA3AF"
        value={form.city}
        onChangeText={v => setForm(f => ({ ...f, city: v }))}
      />
    </Field>

    <View style={styles.row}>
      <View style={styles.fieldHalf}>
        <Text style={styles.label}>State</Text>
        <Pressable style={[styles.iconInput, styles.halfInput]} onPress={onStatePress}>
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

    <Field label="Company Logo">
      <Pressable style={styles.uploadBox} onPress={onLogoPress}>
        {form.logoUri ? (
          <Text style={styles.uploadedText} numberOfLines={1}>{form.logoUri.split('/').pop()}</Text>
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
  const { phoneNumber } = route.params || {};

  const [activeTab, setActiveTab] = useState('renter');

  const defaultForm = { firstName: '', lastName: '', email: '', address: '', city: '', state: '', zipcode: '' };

  const [renterForm, setRenterForm] = useState({ ...defaultForm });
  const [ownerForm, setOwnerForm]   = useState({ ...defaultForm, ownerType: 'Business', businessName: '', logoUri: null });

  const [showStatePicker, setShowStatePicker]     = useState(false);
  const [showOwnerTypePicker, setShowOwnerTypePicker] = useState(false);

  // ── REDUX HOOKS (uncomment when backend is ready) ─────────────────────────
  // const dispatch = useDispatch();
  // const { loading } = useSelector(state => state.register);
  // ─────────────────────────────────────────────────────────────────────────

  const currentForm   = activeTab === 'renter' ? renterForm : ownerForm;
  const setCurrentForm = activeTab === 'renter' ? setRenterForm : setOwnerForm;

  const handleContinue = async () => {
    if (!currentForm.firstName.trim() || !currentForm.lastName.trim()) {
      Alert.alert('Required', 'Please enter your full name.'); return;
    }
    if (!currentForm.email.trim()) {
      Alert.alert('Required', 'Please enter your email.'); return;
    }

    // ── CURRENT FLOW (local AsyncStorage, no backend) ─────────────────────
    try {
      await AsyncStorage.setItem(`USER_${phoneNumber}`, JSON.stringify({
        role: activeTab,
        ...currentForm,
      }));
      navigation.navigate('Verification', { role: activeTab, phoneNumber });
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
    // ─────────────────────────────────────────────────────────────────────

    // ── REDUX FLOW (uncomment when backend is ready, remove block above) ──
    // const formData = new FormData();
    // formData.append('role', activeTab);
    // formData.append('firstName', currentForm.firstName);
    // formData.append('lastName', currentForm.lastName);
    // formData.append('email', currentForm.email);
    // formData.append('phone', phoneNumber);
    // formData.append('address', currentForm.address);
    // formData.append('city', currentForm.city);
    // formData.append('state', currentForm.state);
    // formData.append('zipcode', currentForm.zipcode);
    // if (activeTab === 'owner') {
    //   formData.append('ownerType', ownerForm.ownerType);
    //   formData.append('businessName', ownerForm.businessName);
    //   if (ownerForm.logoUri) {
    //     formData.append('logo', { uri: ownerForm.logoUri, name: 'logo.jpg', type: 'image/jpeg' });
    //   }
    // }
    // const result = await dispatch(registerUser(formData));
    // if (registerUser.fulfilled.match(result)) {
    //   navigation.navigate('Verification', { role: activeTab, phoneNumber });
    // } else {
    //   Alert.alert('Error', result.payload || 'Registration failed.');
    // }
    // ─────────────────────────────────────────────────────────────────────
  };

  const activeState   = currentForm.state;
  const setActiveState = v => setCurrentForm(f => ({ ...f, state: v }));

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

          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, activeTab === 'renter' && styles.tabActive]}
              onPress={() => setActiveTab('renter')}
            >
              <Text style={[styles.tabText, activeTab === 'renter' && styles.tabTextActive]}>
                I'm a Renter
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'owner' && styles.tabActive]}
              onPress={() => setActiveTab('owner')}
            >
              <Text style={[styles.tabText, activeTab === 'owner' && styles.tabTextActive]}>
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
            />
          ) : (
            <OwnerForm
              form={ownerForm}
              setForm={setOwnerForm}
              onStatePress={() => setShowStatePicker(true)}
              onOwnerTypePress={() => setShowOwnerTypePicker(true)}
              onLogoPress={() => {
                // TODO: wire react-native-image-picker here
                Alert.alert('Upload', 'Image picker not wired yet.');
              }}
            />
          )}

          {/* Terms */}
          <Text style={styles.terms}>
            By clicking{' '}
            <Text style={styles.termsBold}>Agree and Continue</Text>
            , I agree to the terms of service and privacy policy
          </Text>

          <CustomButton
            title="Agree and Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueBtn}
            // loading={loading}   // ← uncomment with Redux flow
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* State picker modal */}
      <Modal visible={showStatePicker} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowStatePicker(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select State</Text>
          <FlatList
            data={US_STATES}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.stateItem}
                onPress={() => { setActiveState(item); setShowStatePicker(false); }}
              >
                <Text style={[styles.stateItemText, activeState === item && styles.stateItemActive]}>
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {/* Owner type picker modal */}
      <Modal visible={showOwnerTypePicker} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowOwnerTypePicker(false)} />
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
              <Text style={[styles.stateItemText, ownerForm.ownerType === item && styles.stateItemActive]}>
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