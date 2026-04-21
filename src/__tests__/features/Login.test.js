import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../../Features/Auth/screens/Login';

/* ── Mocks ─────────────────────────────────────────────────────────────── */

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock('react-native-paper', () => {
  const { Text, TextInput } = require('react-native');
  return {
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    TextInput: ({ onChangeText, value, placeholder, ...props }) => (
      <TextInput
        testID="phone-input"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
    ),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-size-matters', () => ({ moderateScale: x => x }));

// correct path relative to this test file
jest.mock('../../Features/Auth/stylesheets/Login.styles', () => ({ styles: {} }));

jest.mock('../../Components/Buttons/CustomButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress, loading }) => (
    <TouchableOpacity testID="continue-btn" onPress={onPress} disabled={!!loading}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

/* ── Helpers ────────────────────────────────────────────────────────────── */

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

function collectText(node, out = []) {
  if (!node) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  for (const child of [].concat(node.children ?? [])) collectText(child, out);
  return out;
}

const buildScreen = async () => {
  let renderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
  });
  return renderer;
};

const typePhone = async (renderer, value) => {
  const input = renderer.root.findByProps({ testID: 'phone-input' });
  await ReactTestRenderer.act(() => input.props.onChangeText(value));
};

const tapContinue = async renderer => {
  const btn = renderer.root.findByProps({ testID: 'continue-btn' });
  await ReactTestRenderer.act(async () => btn.props.onPress());
};

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigation.navigate.mockClear();
  mockNavigation.goBack.mockClear();
});

/* ── Test Suites ─────────────────────────────────────────────────────────── */

describe('Login — rendering', () => {
  it('renders without crashing', async () => {
    const renderer = await buildScreen();
    expect(renderer.toJSON()).toBeTruthy();
  });

  it('renders title "Log in or Sign up"', async () => {
    const renderer = await buildScreen();
    expect(collectText(renderer.toJSON())).toContain('Log in or Sign up');
  });

  it('renders "Phone number" label', async () => {
    const renderer = await buildScreen();
    expect(collectText(renderer.toJSON())).toContain('Phone number');
  });

  it('renders default US calling code +1', async () => {
    const renderer = await buildScreen();
    expect(collectText(renderer.toJSON())).toContain('+1');
  });

  it('renders the Continue button', async () => {
    const renderer = await buildScreen();
    const btn = renderer.root.findByProps({ testID: 'continue-btn' });
    expect(btn).toBeTruthy();
  });

  it('phone input starts empty', async () => {
    const renderer = await buildScreen();
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('');
  });
});

describe('Login — phone input behaviour', () => {
  it('accepts digit input and updates value', async () => {
    const renderer = await buildScreen();
    await typePhone(renderer, '1234567890');
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('1234567890');
  });

  it('strips non-digit characters', async () => {
    const renderer = await buildScreen();
    await typePhone(renderer, 'abc123def456');
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('123456');
  });

  it('truncates input to max length of 10 for US', async () => {
    const renderer = await buildScreen();
    await typePhone(renderer, '123456789099999');
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('1234567890');
  });

  it('allows exactly 10 digits without truncation', async () => {
    const renderer = await buildScreen();
    await typePhone(renderer, '9876543210');
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('9876543210');
  });

  it('accepts partial input (fewer than max digits)', async () => {
    const renderer = await buildScreen();
    await typePhone(renderer, '55512');
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    expect(input.props.value).toBe('55512');
  });
});

describe('Login — validation on Continue', () => {
  it('shows Alert when phone is empty', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const renderer = await buildScreen();
    await tapContinue(renderer);

    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid number',
      'Please enter a valid 10-digit phone number.',
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('shows Alert when phone is shorter than 10 digits', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const renderer = await buildScreen();
    await typePhone(renderer, '12345');
    await tapContinue(renderer);

    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid number',
      'Please enter a valid 10-digit phone number.',
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('does not show Alert when phone has exactly 10 digits', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const alertSpy = jest.spyOn(Alert, 'alert');
    const renderer = await buildScreen();
    await typePhone(renderer, '1234567890');
    await tapContinue(renderer);

    expect(alertSpy).not.toHaveBeenCalled();
  });
});

describe('Login — navigation on Continue', () => {
  it('navigates to OtpVerification as new user when no AsyncStorage record', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const renderer = await buildScreen();
    await typePhone(renderer, '1234567890');
    await tapContinue(renderer);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', {
      phoneNumber: '+11234567890',
      isNewUser: true,
    });
  });

  it('navigates to OtpVerification as existing user when AsyncStorage has a record', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'Jane' }));
    const renderer = await buildScreen();
    await typePhone(renderer, '1234567890');
    await tapContinue(renderer);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', {
      phoneNumber: '+11234567890',
      isNewUser: false,
    });
  });

  it('builds the full phone number by prepending the calling code', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const renderer = await buildScreen();
    await typePhone(renderer, '9998887777');
    await tapContinue(renderer);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', {
      phoneNumber: '+19998887777',
      isNewUser: true,
    });
  });

  it('looks up AsyncStorage with the correct key including calling code', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const renderer = await buildScreen();
    await typePhone(renderer, '9876543210');
    await tapContinue(renderer);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('USER_+19876543210');
  });

  it('navigates only once per Continue press', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const renderer = await buildScreen();
    await typePhone(renderer, '1234567890');
    await tapContinue(renderer);

    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
  });
});

describe('Login — back button', () => {
  it('calls navigation.goBack when back button is pressed', async () => {
    const renderer = await buildScreen();
    const backBtn = renderer.root.findAllByProps({ hitSlop: 10 })[0];
    await ReactTestRenderer.act(() => backBtn.props.onPress());

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});
