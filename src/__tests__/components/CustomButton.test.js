import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../../Components/Buttons/CustomButton';
import { Button } from 'react-native-paper';

// Mock moderateScale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

describe('CustomButton', () => {
  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders title correctly', () => {
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('renders children instead of title if provided', () => {
    const { getByText, queryByText } = render(
      <CustomButton title="Title" onPress={onPressMock}>
        Child Text
      </CustomButton>
    );

    expect(getByText('Child Text')).toBeTruthy();
    expect(queryByText('Title')).toBeNull();
  });

  // ─────────────────────────────
  // PRESS
  // ─────────────────────────────
  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click Me'));

    expect(onPressMock).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click Me'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} loading />
    );

    fireEvent.press(getByText('Click Me'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  // ─────────────────────────────
  // VARIANT → MODE
  // ─────────────────────────────
  it('maps variant to correct mode', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Test" onPress={onPressMock} variant="outline" />
    );

    const button = UNSAFE_getByType(Button);

    expect(button.props.mode).toBe('outlined');
  });

  it('falls back to contained mode for invalid variant', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Test" onPress={onPressMock} variant="invalid" />
    );

    const button = UNSAFE_getByType(Button);

    expect(button.props.mode).toBe('contained');
  });

  // ─────────────────────────────
  // SIZE
  // ─────────────────────────────
  it('applies correct size styles', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Test" onPress={onPressMock} size="large" />
    );

    const button = UNSAFE_getByType(Button);

    const labelStyle = button.props.labelStyle;

    expect(labelStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 18 }),
      ])
    );
  });

  // ─────────────────────────────
  // ICON
  // ─────────────────────────────
  it('renders icon when leftIcon is provided', () => {
    const mockIcon = <></>;

    const { UNSAFE_getByType } = render(
      <CustomButton
        title="Test"
        onPress={onPressMock}
        leftIcon={mockIcon}
      />
    );

    const button = UNSAFE_getByType(Button);

    expect(button.props.icon).toBeDefined();
  });
});