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

jest.mock('../../Components/Buttons/CustomButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ title, onPress }) => (
    <TouchableOpacity testID="continue-btn" onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../Features/Auth/Login.styles', () => ({ styles: {} }));

/* ── Helpers ────────────────────────────────────────────────────────────── */

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

/** Collect all text strings from a toJSON() tree. */
function collectText(node, results = []) {
  if (!node) return results;
  if (typeof node === 'string') { results.push(node); return results; }
  for (const child of [].concat(node.children ?? [])) {
    collectText(child, results);
  }
  return results;
}

beforeEach(() => jest.clearAllMocks());

/* ── Tests ──────────────────────────────────────────────────────────────── */

describe('Login screen', () => {
  it('renders without crashing', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    expect(renderer.toJSON()).toBeTruthy();
  });

  it('renders title text', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    expect(collectText(renderer.toJSON())).toContain('Log in or Sign up');
  });

  it('renders calling code +1 for default US', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    expect(collectText(renderer.toJSON())).toContain('+1');
  });

  it('shows initial digit counter 0/10', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    expect(collectText(renderer.toJSON()).join('')).toContain('0/10');
  });

  it('strips non-digit characters and updates phone value', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('abc123def'));
    expect(input.props.value).toBe('123');
  });

  it('truncates input to max length of 10 for US', async () => {
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('12345678901234'));
    expect(input.props.value).toBe('1234567890');
  });

  it('shows Alert when phone is shorter than max length', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('12345'));

    const btn = renderer.root.findByProps({ testID: 'continue-btn' });
    await ReactTestRenderer.act(async () => btn.props.onPress());

    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid number',
      'Please enter a valid 10-digit phone number.',
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('navigates to OtpVerification as new user when no AsyncStorage record', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('1234567890'));

    const btn = renderer.root.findByProps({ testID: 'continue-btn' });
    await ReactTestRenderer.act(async () => btn.props.onPress());

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', {
      phoneNumber: '+11234567890',
      isNewUser: true,
    });
  }); 

  it('navigates to OtpVerification as existing user when AsyncStorage has a record', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'Jane' }));
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('1234567890'));

    const btn = renderer.root.findByProps({ testID: 'continue-btn' });
    await ReactTestRenderer.act(async () => btn.props.onPress());

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', {
      phoneNumber: '+11234567890',
      isNewUser: false,
    });
  });

  it('looks up AsyncStorage with the correct key', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    let renderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<Login navigation={mockNavigation} />);
    });
    const input = renderer.root.findByProps({ testID: 'phone-input' });
    await ReactTestRenderer.act(() => input.props.onChangeText('9876543210'));

    const btn = renderer.root.findByProps({ testID: 'continue-btn' });
    await ReactTestRenderer.act(async () => btn.props.onPress());

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('USER_+19876543210');
  });
});
