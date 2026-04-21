import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomCheckbox from '../../Components/Checkbox/CustomCheckbox';
import { Checkbox, TouchableRipple,Text } from 'react-native-paper';

// Mock theme
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    useTheme: () => ({
      colors: {
        primary: 'blue',
        error: 'red',
        onSurface: 'black',
      },
    }),
  };
});

describe('CustomCheckbox', () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders label correctly', () => {
    const { getByText } = render(
      <CustomCheckbox
        value={false}
        onValueChange={onChangeMock}
        label="Accept Terms"
      />
    );

    expect(getByText('Accept Terms')).toBeTruthy();
  });

  it('renders custom labelComponent if provided', () => {
    const { getByText } = render(
      <CustomCheckbox
        value={false}
        onValueChange={onChangeMock}
        labelComponent={<Text>Custom Label</Text>}
      />
    );

    expect(getByText('Custom Label')).toBeTruthy();
  });

  // ─────────────────────────────
  // TOGGLE
  // ─────────────────────────────
  it('toggles value when TouchableRipple pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomCheckbox value={false} onValueChange={onChangeMock} />
    );

    const ripple = UNSAFE_getByType(TouchableRipple);

    fireEvent.press(ripple);

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('toggles value when Checkbox pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomCheckbox value={false} onValueChange={onChangeMock} />
    );

    const checkbox = UNSAFE_getByType(Checkbox);

    fireEvent.press(checkbox);

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  it('shows checked state when value is true', () => {
    const { UNSAFE_getByType } = render(
      <CustomCheckbox value={true} onValueChange={onChangeMock} />
    );

    const checkbox = UNSAFE_getByType(Checkbox);

    expect(checkbox.props.status).toBe('checked');
  });

  it('shows unchecked state when value is false', () => {
    const { UNSAFE_getByType } = render(
      <CustomCheckbox value={false} onValueChange={onChangeMock} />
    );

    const checkbox = UNSAFE_getByType(Checkbox);

    expect(checkbox.props.status).toBe('unchecked');
  });

  // ─────────────────────────────
  // ERROR STATE
  // ─────────────────────────────
  it('uses error color when error is true', () => {
    const { UNSAFE_getByType } = render(
      <CustomCheckbox
        value={false}
        onValueChange={onChangeMock}
        error
      />
    );

    const checkbox = UNSAFE_getByType(Checkbox);

    expect(checkbox.props.color).toBe('red');
  });
});