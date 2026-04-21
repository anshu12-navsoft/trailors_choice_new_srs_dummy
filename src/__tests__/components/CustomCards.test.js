import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomCards from '../../Components/Card/CustomCards';
import { Card,Text } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

describe('CustomCards', () => {
  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders children correctly', () => {
    const { getByText } = render(
      <CustomCards>
        <Text>Card Content</Text>
      </CustomCards>
    );

    expect(getByText('Card Content')).toBeTruthy();
  });

  // ─────────────────────────────
  // PRESS
  // ─────────────────────────────
  it('calls onPress when pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomCards onPress={onPressMock}>
        <Text>Card</Text>
      </CustomCards>
    );

    const card = UNSAFE_getByType(Card);

    fireEvent.press(card);

    expect(onPressMock).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // VARIANT → MODE
  // ─────────────────────────────
  it('maps default variant correctly', () => {
    const { UNSAFE_getByType } = render(
      <CustomCards>
        <Text>Card</Text>
      </CustomCards>
    );

    const card = UNSAFE_getByType(Card);

    expect(card.props.mode).toBe('elevated');
  });

  it('maps outlined variant correctly', () => {
    const { UNSAFE_getByType } = render(
      <CustomCards variant="outlined">
        <Text>Card</Text>
      </CustomCards>
    );

    const card = UNSAFE_getByType(Card);

    expect(card.props.mode).toBe('outlined');
  });

  it('falls back to default for invalid variant', () => {
    const { UNSAFE_getByType } = render(
      <CustomCards variant="invalid">
        <Text>Card</Text>
      </CustomCards>
    );

    const card = UNSAFE_getByType(Card);

    expect(card.props.mode).toBe('elevated');
  });
});