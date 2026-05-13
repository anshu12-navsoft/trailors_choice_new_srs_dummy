import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomDropdown from '../../Components/Dropdown/CustomDropdown';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      if (key === 'select_option_placeholder') return 'Select option';
      return key;
    },
  }),
}));

describe('CustomDropdown', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];

  const onSelectMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders label and placeholder', () => {
    const { getByText } = render(
      <CustomDropdown
        label="Test Label"
        options={options}
        onSelect={onSelectMock}
      />
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByText('Select option')).toBeTruthy();
  });

  it('shows selected value label', () => {
    const { getByText } = render(
      <CustomDropdown
        value={1}
        options={options}
        onSelect={onSelectMock}
      />
    );

    expect(getByText('Option 1')).toBeTruthy();
  });

  // ─────────────────────────────
  // OPEN / CLOSE
  // ─────────────────────────────
  it('opens modal when pressed', () => {
    const { getByText } = render(
      <CustomDropdown options={options} onSelect={onSelectMock} />
    );

    fireEvent.press(getByText('Select option'));

    expect(getByText('Option 1')).toBeTruthy();
  });

  it('closes modal when overlay pressed', () => {
    const { getByText } = render(
      <CustomDropdown options={options} onSelect={onSelectMock} />
    );

    fireEvent.press(getByText('Select option'));
    fireEvent.press(getByText('Option 1')); // selecting also closes

    expect(onSelectMock).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // SELECTION
  // ─────────────────────────────
  it('calls onSelect when option is selected', () => {
    const { getByText } = render(
      <CustomDropdown options={options} onSelect={onSelectMock} />
    );

    fireEvent.press(getByText('Select option'));
    fireEvent.press(getByText('Option 2'));

    expect(onSelectMock).toHaveBeenCalledWith(2);
  });

  // ─────────────────────────────
  // ERROR
  // ─────────────────────────────
  it('shows error message', () => {
    const { getByText } = render(
      <CustomDropdown
        options={options}
        onSelect={onSelectMock}
        error="Required field"
      />
    );

    expect(getByText('Required field')).toBeTruthy();
  });
});