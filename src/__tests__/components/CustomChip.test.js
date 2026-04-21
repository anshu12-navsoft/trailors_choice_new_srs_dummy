import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomChip from '../../Components/Chip/CustomChip';
import { Chip } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
  verticalScale: v => v,
}));

describe('CustomChip', () => {
  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders label correctly', () => {
    const { getByText } = render(
      <CustomChip label="Test Chip" onPress={onPressMock} />
    );

    expect(getByText('Test Chip')).toBeTruthy();
  });

  // ─────────────────────────────
  // PRESS
  // ─────────────────────────────
  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <CustomChip label="Test Chip" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Test Chip'));

    expect(onPressMock).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = render(
      <CustomChip label="Test Chip" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Test Chip'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  it('passes selected prop correctly', () => {
    const { UNSAFE_getByType } = render(
      <CustomChip label="Test Chip" selected />
    );

    const chip = UNSAFE_getByType(Chip);

    expect(chip.props.selected).toBe(true);
  });

  // ─────────────────────────────
  // ICON
  // ─────────────────────────────
  it('renders icon when leftIcon is provided', () => {
    const mockIcon = <></>;

    const { UNSAFE_getByType } = render(
      <CustomChip label="Test Chip" leftIcon={mockIcon} />
    );

    const chip = UNSAFE_getByType(Chip);

    expect(chip.props.icon).toBeDefined();
  });
});