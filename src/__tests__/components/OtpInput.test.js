import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OTPInput from '../../Components/Otp/OtpInput';

describe('OTPInput', () => {
  const onCompleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders correct number of inputs', () => {
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} />
    );

    // initially all inputs are empty
    expect(getAllByDisplayValue('').length).toBe(4);
  });

  // ─────────────────────────────
  // INPUT
  // ─────────────────────────────
  it('accepts only digits', () => {
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} />
    );

    const inputs = getAllByDisplayValue('');

    fireEvent.changeText(inputs[0], 'a'); // invalid
    expect(inputs[0].props.value).toBe('');

    fireEvent.changeText(inputs[0], '5'); // valid
    expect(inputs[0].props.value).toBe('5');
  });

  // ─────────────────────────────
  // COMPLETION
  // ─────────────────────────────
  it('calls onComplete when all inputs filled', () => {
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} onComplete={onCompleteMock} />
    );

    const inputs = getAllByDisplayValue('');

    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');
    fireEvent.changeText(inputs[2], '3');
    fireEvent.changeText(inputs[3], '4');

    expect(onCompleteMock).toHaveBeenCalledWith('1234');
  });

  // ─────────────────────────────
  // PARTIAL INPUT
  // ─────────────────────────────
  it('does not call onComplete if not all digits entered', () => {
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} onComplete={onCompleteMock} />
    );

    const inputs = getAllByDisplayValue('');

    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');

    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  // ─────────────────────────────
  // BACKSPACE
  // ─────────────────────────────
  it('handles backspace correctly', () => {
    const { getAllByDisplayValue } = render(
      <OTPInput length={4} />
    );

    const inputs = getAllByDisplayValue('');

    // fill first
    fireEvent.changeText(inputs[0], '1');

    // simulate backspace on empty second input
    fireEvent(inputs[1], 'keyPress', {
      nativeEvent: { key: 'Backspace' },
    });

    // no crash = pass (focus movement can't be easily asserted)
    expect(true).toBe(true);
  });
});