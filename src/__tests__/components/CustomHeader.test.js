import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomHeader from '../../Components/Header/CustomHeader';
import { Appbar } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

// Mock safe area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10 }),
}));

// Mock theme
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    useTheme: () => ({
      colors: {
        surface: '#fff',
        onSurface: '#000',
      },
    }),
  };
});

describe('CustomHeader', () => {
  const onBackMock = jest.fn();
  const action1 = jest.fn();
  const action2 = jest.fn();
  const action3 = jest.fn();

  const actions = [
    { icon: 'magnify', onPress: action1, accessibilityLabel: 'Search' },
    { icon: 'dots-vertical', onPress: action2, accessibilityLabel: 'Menu' },
    { icon: 'extra', onPress: action3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // TITLE
  // ─────────────────────────────
  it('renders title correctly', () => {
    const { getByText } = render(
      <CustomHeader title="My Screen" />
    );

    expect(getByText('My Screen')).toBeTruthy();
  });

  // ─────────────────────────────
  // BACK BUTTON
  // ─────────────────────────────
  it('renders back button when onBack is provided', () => {
    const { UNSAFE_getByType } = render(
      <CustomHeader title="Test" onBack={onBackMock} />
    );

    const backBtn = UNSAFE_getByType(Appbar.BackAction);

    expect(backBtn).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomHeader title="Test" onBack={onBackMock} />
    );

    const backBtn = UNSAFE_getByType(Appbar.BackAction);

    fireEvent.press(backBtn);

    expect(onBackMock).toHaveBeenCalled();
  });

  it('does not render back button when onBack is not provided', () => {
    const { queryByType } = render(
      <CustomHeader title="Test" />
    );

    expect(queryByType(Appbar.BackAction)).toBeNull();
  });

  // ─────────────────────────────
  // RIGHT ACTIONS
  // ─────────────────────────────
  it('renders only first 2 right actions', () => {
    const { UNSAFE_getAllByType } = render(
      <CustomHeader title="Test" rightActions={actions} />
    );

    const actionButtons = UNSAFE_getAllByType(Appbar.Action);

    expect(actionButtons.length).toBe(2);
  });

  it('calls correct action when pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <CustomHeader title="Test" rightActions={actions} />
    );

    const actionButtons = UNSAFE_getAllByType(Appbar.Action);

    fireEvent.press(actionButtons[0]);
    fireEvent.press(actionButtons[1]);

    expect(action1).toHaveBeenCalled();
    expect(action2).toHaveBeenCalled();
    expect(action3).not.toHaveBeenCalled(); // third shouldn't render
  });
});