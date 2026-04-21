import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomIconButton from '../../Components/Buttons/CustomIconButton';
import { IconButton } from 'react-native-paper';

// Mock moderateScale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

describe('CustomIconButton', () => {
  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders correctly', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} />
    );

    const button = UNSAFE_getByType(IconButton);

    expect(button).toBeTruthy();
  });

  // ─────────────────────────────
  // PRESS
  // ─────────────────────────────
  it('calls onPress when pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} />
    );

    const button = UNSAFE_getByType(IconButton);

    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} disabled />
    );

    const button = UNSAFE_getByType(IconButton);

    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} loading />
    );

    const button = UNSAFE_getByType(IconButton);

    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  // ─────────────────────────────
  // VARIANT → MODE
  // ─────────────────────────────
  it('maps variant to correct mode', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} variant="primary" />
    );

    const button = UNSAFE_getByType(IconButton);

    expect(button.props.mode).toBe('contained');
  });

  it('uses undefined mode for ghost variant (default)', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} />
    );

    const button = UNSAFE_getByType(IconButton);

    expect(button.props.mode).toBeUndefined();
  });

  // ─────────────────────────────
  // DISABLED LOGIC
  // ─────────────────────────────
  it('is disabled when loading is true', () => {
    const { UNSAFE_getByType } = render(
      <CustomIconButton icon="home" onPress={onPressMock} loading />
    );

    const button = UNSAFE_getByType(IconButton);

    expect(button.props.disabled).toBe(true);
  });
});