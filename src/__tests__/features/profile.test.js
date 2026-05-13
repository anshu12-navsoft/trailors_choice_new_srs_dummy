import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../Features/Profile/screens/Profile'; // adjust path if needed
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../../App/Redux/Slices/authSlice';
import * as mediaPicker from '../../../utils/helpers/mediaPicker.helper';

// ─────────────────────────────────────────────
// MOCKS
// ─────────────────────────────────────────────

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

// Mock redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock logout action
jest.mock('../../../App/Redux/Slices/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'LOGOUT' })),
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

// Mock media picker
jest.spyOn(mediaPicker, 'openCamera');
jest.spyOn(mediaPicker, 'openGallery');

// Mock Alert
jest.spyOn(Alert, 'alert');

// ─────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────

describe('Profile Screen', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // RENDER TEST
  // ─────────────────────────────────────────────
  it('renders profile screen correctly', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Anand Shaw')).toBeTruthy();
    expect(getByText('Member since March 2026')).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // NAVIGATION TEST
  // ─────────────────────────────────────────────
  it('navigates to EditProfile on profile press', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    fireEvent.press(getByText('Anand Shaw'));

    expect(mockNavigate).toHaveBeenCalledWith('EditProfile', {
      name: 'Anand Shaw',
      phone: '+1 99326 59658',
      accountStatus: 'active',
    });
  });

  // ─────────────────────────────────────────────
  // MENU NAVIGATION TESTS
  // ─────────────────────────────────────────────
  it('navigates to MyRentals when Rental History pressed', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    fireEvent.press(getByText('menu_rental_history'));

    expect(mockNavigate).toHaveBeenCalledWith('MyRentals');
  });

  it('navigates to OwnerBookings when Wishlist pressed', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    fireEvent.press(getByText('menu_wishlist'));

    expect(mockNavigate).toHaveBeenCalledWith('OwnerBookings');
  });

  it('navigates to Settings when Settings pressed', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    fireEvent.press(getByText('settings_title'));

    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  // ─────────────────────────────────────────────
  // LOGOUT TEST
  // ─────────────────────────────────────────────
  it('dispatches logout on logout press', () => {
    const { getByText } = render(<Profile navigation={navigation} />);

    fireEvent.press(getByText('Log Out'));

    expect(dispatch).toHaveBeenCalledWith(logout());
  });

  // ─────────────────────────────────────────────
  // PHOTO PICKER TESTS
  // ─────────────────────────────────────────────
  it('opens alert when clicking profile photo edit', () => {
    const { getAllByRole } = render(<Profile navigation={navigation} />);

    const buttons = getAllByRole('button');

    fireEvent.press(buttons[1]); // pencil icon

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('handles camera selection correctly', async () => {
    mediaPicker.openCamera.mockResolvedValue({
      uri: 'test-image.jpg',
    });

    const { getAllByRole } = render(<Profile navigation={navigation} />);

    fireEvent.press(getAllByRole('button')[1]);

    const alertArgs = Alert.alert.mock.calls[0][2];

    const cameraOption = alertArgs.find(opt => opt.text === 'camera_option');

    await cameraOption.onPress();

    expect(mediaPicker.openCamera).toHaveBeenCalled();
  });

  it('handles gallery selection correctly', async () => {
    mediaPicker.openGallery.mockResolvedValue({
      uri: 'gallery-image.jpg',
    });

    const { getAllByRole } = render(<Profile navigation={navigation} />);

    fireEvent.press(getAllByRole('button')[1]);

    const alertArgs = Alert.alert.mock.calls[0][2];

    const galleryOption = alertArgs.find(opt => opt.text === 'gallery_option');

    await galleryOption.onPress();

    expect(mediaPicker.openGallery).toHaveBeenCalled();
  });

  it('handles camera error gracefully', async () => {
    mediaPicker.openCamera.mockRejectedValue(new Error('Camera failed'));

    const { getAllByRole } = render(<Profile navigation={navigation} />);

    fireEvent.press(getAllByRole('button')[1]);

    const alertArgs = Alert.alert.mock.calls[0][2];

    const cameraOption = alertArgs.find(opt => opt.text === 'camera_option');

    await cameraOption.onPress();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Camera failed');
    });
  });

  // ─────────────────────────────────────────────
  // BACK BUTTON TEST
  // ─────────────────────────────────────────────
  it('calls goBack when header back is pressed', () => {
    const { getByTestId } = render(<Profile navigation={navigation} />);

    // depends on CustomHeader having testID
    const backButton = getByTestId('back-button');

    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });
});