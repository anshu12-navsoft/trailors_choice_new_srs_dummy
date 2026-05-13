import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomTextInput from '../../Components/TextInput/CustomTextInput';
import { TextInput } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

describe('CustomTextInput', () => {
  const onChangeMock = jest.fn();
  const onSubmitMock = jest.fn();
  const onFocusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <CustomTextInput
        label="Email"
        placeholder="Enter email"
        value=""
        onChangeText={onChangeMock}
      />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('renders value correctly', () => {
    const { getByDisplayValue } = render(
      <CustomTextInput
        value="test@example.com"
        onChangeText={onChangeMock}
      />
    );

    expect(getByDisplayValue('test@example.com')).toBeTruthy();
  });

  // ─────────────────────────────
  // INPUT
  // ─────────────────────────────
  it('calls onChangeText when typing', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput
        placeholder="Type"
        value=""
        onChangeText={onChangeMock}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Type'), 'hello');

    expect(onChangeMock).toHaveBeenCalledWith('hello');
  });

  // ─────────────────────────────
  // ERROR / HELPER
  // ─────────────────────────────
  it('shows error text when error is provided', () => {
    const { getByText } = render(
      <CustomTextInput
        value=""
        onChangeText={onChangeMock}
        error="Invalid input"
      />
    );

    expect(getByText('Invalid input')).toBeTruthy();
  });

  it('shows helper text when no error', () => {
    const { getByText } = render(
      <CustomTextInput
        value=""
        onChangeText={onChangeMock}
        helperText="Helper message"
      />
    );

    expect(getByText('Helper message')).toBeTruthy();
  });

  it('prioritizes error over helper text', () => {
    const { getByText, queryByText } = render(
      <CustomTextInput
        value=""
        onChangeText={onChangeMock}
        error="Error message"
        helperText="Helper message"
      />
    );

    expect(getByText('Error message')).toBeTruthy();
    expect(queryByText('Helper message')).toBeNull();
  });

  // ─────────────────────────────
  // ICONS
  // ─────────────────────────────
  it('renders left and right icons', () => {
    const { UNSAFE_getByType } = render(
      <CustomTextInput
        value=""
        onChangeText={onChangeMock}
        leftIcon={<></>}
        rightIcon={<></>}
      />
    );

    const input = UNSAFE_getByType(TextInput);

    expect(input.props.left).toBeDefined();
    expect(input.props.right).toBeDefined();
  });

  // ─────────────────────────────
  // EVENTS
  // ─────────────────────────────
  it('calls onSubmitEditing', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput
        placeholder="Enter"
        value=""
        onChangeText={onChangeMock}
        onSubmitEditing={onSubmitMock}
      />
    );

    fireEvent(getByPlaceholderText('Enter'), 'submitEditing');

    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('calls onFocus', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput
        placeholder="Enter"
        value=""
        onChangeText={onChangeMock}
        onFocus={onFocusMock}
      />
    );

    fireEvent(getByPlaceholderText('Enter'), 'focus');

    expect(onFocusMock).toHaveBeenCalled();
  });
});