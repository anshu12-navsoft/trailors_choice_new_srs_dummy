import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomAlert from '../../Components/Alert/CustomAlert';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => key,
  }),
}));

describe('CustomAlert', () => {
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    message: 'Test Message',
    onPrimaryPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER TESTS
  // ─────────────────────────────
  it('renders title and message', () => {
    const { getByText } = render(<CustomAlert {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
  });

  it('does not render title if not provided', () => {
    const { queryByText } = render(
      <CustomAlert {...defaultProps} title={null} />
    );

    expect(queryByText('Test Title')).toBeNull();
  });

  // ─────────────────────────────
  // BUTTON TESTS
  // ─────────────────────────────
  it('renders primary button with default text', () => {
    const { getByText } = render(<CustomAlert {...defaultProps} />);

    expect(getByText('ok_button')).toBeTruthy();
  });

  it('renders custom primary text if provided', () => {
    const { getByText } = render(
      <CustomAlert {...defaultProps} primaryText="Confirm" />
    );

    expect(getByText('Confirm')).toBeTruthy();
  });

  it('renders secondary button only if provided', () => {
    const { getByText } = render(
      <CustomAlert {...defaultProps} secondaryText="Cancel" />
    );

    expect(getByText('Cancel')).toBeTruthy();
  });

  it('does not render secondary button if not provided', () => {
    const { queryByText } = render(<CustomAlert {...defaultProps} />);

    expect(queryByText('Cancel')).toBeNull();
  });

  // ─────────────────────────────
  // ACTION TESTS
  // ─────────────────────────────
  it('calls onPrimaryPress when primary button pressed', () => {
    const { getByText } = render(<CustomAlert {...defaultProps} />);

    fireEvent.press(getByText('ok_button'));

    expect(defaultProps.onPrimaryPress).toHaveBeenCalled();
  });

  it('calls onSecondaryPress when secondary button pressed', () => {
    const onSecondaryPress = jest.fn();

    const { getByText } = render(
      <CustomAlert
        {...defaultProps}
        secondaryText="Cancel"
        onSecondaryPress={onSecondaryPress}
      />
    );

    fireEvent.press(getByText('Cancel'));

    expect(onSecondaryPress).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // DISMISS BEHAVIOR
  // ─────────────────────────────
  it('calls onSecondaryPress on dismiss if dismissible', () => {
    const onSecondaryPress = jest.fn();

    const { UNSAFE_getByType } = render(
      <CustomAlert
        {...defaultProps}
        dismissible
        onSecondaryPress={onSecondaryPress}
      />
    );

    const dialog = UNSAFE_getByType(require('react-native-paper').Dialog);

    dialog.props.onDismiss();

    expect(onSecondaryPress).toHaveBeenCalled();
  });

  it('does not call onSecondaryPress if not dismissible', () => {
    const onSecondaryPress = jest.fn();

    const { UNSAFE_getByType } = render(
      <CustomAlert
        {...defaultProps}
        dismissible={false}
        onSecondaryPress={onSecondaryPress}
      />
    );

    const dialog = UNSAFE_getByType(require('react-native-paper').Dialog);

    dialog.props.onDismiss();

    expect(onSecondaryPress).not.toHaveBeenCalled();
  });
});