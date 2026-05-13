import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OtpVerification from '../OtpVerification'; // adjust path
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';

// ─────────────────────────────
// MOCKS
// ─────────────────────────────

// Mock redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

// Mock loginSuccess
jest.mock('../../../App/Redux/Slices/authSlice', () => ({
  loginSuccess: jest.fn(() => ({ type: 'LOGIN_SUCCESS' })),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Navigation mocks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: mockReset,
};

// Default route
const route = {
  params: {
    phoneNumber: '+1234567890',
    isNewUser: true,
  },
};

describe('OtpVerification Screen', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER TEST
  // ─────────────────────────────
  it('renders correctly', () => {
    const { getByText } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    expect(getByText('Confirm your number')).toBeTruthy();
    expect(getByText('+1234567890')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  // ─────────────────────────────
  // BACK BUTTON
  // ─────────────────────────────
  it('goes back on back button press', () => {
    const { getAllByRole } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    fireEvent.press(getAllByRole('button')[0]);

    expect(mockGoBack).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // OTP INPUT
  // ─────────────────────────────
  it('accepts only numeric input and limits to 6 digits', () => {
    const { getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    const input = getByDisplayValue('');

    fireEvent.changeText(input, 'abc123456789');

    expect(input.props.value).toBe('123456');
  });

  // ─────────────────────────────
  // INVALID OTP
  // ─────────────────────────────
  it('shows error if OTP is less than 6 digits', async () => {
    const { getByText, getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    const input = getByDisplayValue('');
    fireEvent.changeText(input, '123');

    fireEvent.press(getByText('Continue'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Invalid code',
      'Please enter the 6-digit code.'
    );
  });

  // ─────────────────────────────
  // NEW USER FLOW
  // ─────────────────────────────
  it('handles new user flow correctly', async () => {
    const { getByText, getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    const input = getByDisplayValue('');
    fireEvent.changeText(input, '123456');

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'USER_+1234567890',
        'pending'
      );
      expect(mockNavigate).toHaveBeenCalledWith('Register', {
        phoneNumber: '+1234567890',
      });
    });
  });

  // ─────────────────────────────
  // EXISTING USER FLOW
  // ─────────────────────────────
  it('handles existing user login correctly', async () => {
    const existingRoute = {
      params: {
        phoneNumber: '+1234567890',
        isNewUser: false,
      },
    };

    const { getByText, getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={existingRoute} />
    );

    const input = getByDisplayValue('');
    fireEvent.changeText(input, '123456');

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'LAST_USER_ID',
        '+1234567890'
      );
      expect(dispatch).toHaveBeenCalledWith(loginSuccess());
    });
  });

  // ─────────────────────────────
  // ERROR HANDLING
  // ─────────────────────────────
  it('handles AsyncStorage error gracefully', async () => {
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

    const { getByText, getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    const input = getByDisplayValue('');
    fireEvent.changeText(input, '123456');

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Something went wrong. Please try again.'
      );
    });
  });

  // ─────────────────────────────
  // RESEND LOGIC
  // ─────────────────────────────
  it('resend button disabled initially', () => {
    const { getByText } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    expect(getByText(/resend in/i)).toBeTruthy();
  });

  it('enables resend after timer reaches 0', async () => {
    jest.useFakeTimers();

    const { getByText } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(getByText('resend')).toBeTruthy();
    });

    jest.useRealTimers();
  });

  it('resets OTP and timer on resend', async () => {
    jest.useFakeTimers();

    const { getByText, getByDisplayValue } = render(
      <OtpVerification navigation={navigation} route={route} />
    );

    // Fast-forward timer
    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      fireEvent.press(getByText('resend'));
    });

    const input = getByDisplayValue('');

    expect(input.props.value).toBe('');

    jest.useRealTimers();
  });
});