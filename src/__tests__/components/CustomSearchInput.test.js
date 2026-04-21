import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomSearchInput from '../../Components/TextInput/CustomSearchInput';
import { Searchbar } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      if (key === 'search_placeholder') return 'Search here...';
      return key;
    },
  }),
}));

describe('CustomSearchInput', () => {
  const onChangeMock = jest.fn();
  const onClearMock = jest.fn();
  const onFocusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders translated placeholder when no placeholder provided', () => {
    const { getByPlaceholderText } = render(
      <CustomSearchInput
        value=""
        onChangeText={onChangeMock}
      />
    );

    expect(getByPlaceholderText('Search here...')).toBeTruthy();
  });

  it('renders custom placeholder when provided', () => {
    const { getByPlaceholderText } = render(
      <CustomSearchInput
        value=""
        onChangeText={onChangeMock}
        placeholder="Custom placeholder"
      />
    );

    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
  });

  it('renders value correctly', () => {
    const { getByDisplayValue } = render(
      <CustomSearchInput
        value="hello"
        onChangeText={onChangeMock}
      />
    );

    expect(getByDisplayValue('hello')).toBeTruthy();
  });

  // ─────────────────────────────
  // INPUT
  // ─────────────────────────────
  it('calls onChangeText when typing', () => {
    const { getByPlaceholderText } = render(
      <CustomSearchInput
        value=""
        onChangeText={onChangeMock}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Search here...'), 'test');

    expect(onChangeMock).toHaveBeenCalledWith('test');
  });

  // ─────────────────────────────
  // CLEAR
  // ─────────────────────────────
  it('calls onClear when clear icon pressed', () => {
    const { UNSAFE_getByType } = render(
      <CustomSearchInput
        value="hello"
        onChangeText={onChangeMock}
        onClear={onClearMock}
      />
    );

    const searchbar = UNSAFE_getByType(Searchbar);

    fireEvent(searchbar, 'onClearIconPress');

    expect(onClearMock).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // FOCUS
  // ─────────────────────────────
  it('calls onFocus when focused', () => {
    const { getByPlaceholderText } = render(
      <CustomSearchInput
        value=""
        onChangeText={onChangeMock}
        onFocus={onFocusMock}
      />
    );

    fireEvent(getByPlaceholderText('Search here...'), 'focus');

    expect(onFocusMock).toHaveBeenCalled();
  });
});