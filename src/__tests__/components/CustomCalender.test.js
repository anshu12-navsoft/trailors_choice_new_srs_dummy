import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomCalender from '../../Components/Calender/CustomCalender';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

// Mock CalendarList
jest.mock('react-native-calendars', () => {
  return {
    CalendarList: ({ onDayPress }) => {
      return (
        <>
          {/* Fake days */}
          <Text onPress={() => onDayPress({ dateString: '2026-01-01' })}>
            Day1
          </Text>
          <Text onPress={() => onDayPress({ dateString: '2026-01-05' })}>
            Day2
          </Text>
        </>
      );
    },
  };
});

// Mock theme
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    useTheme: () => ({
      colors: {
        background: '#fff',
        onBackground: '#000',
        primary: '#000',
        outline: '#ccc',
        onSurface: '#000',
        onSurfaceVariant: '#666',
        onSurfaceDisabled: '#999',
      },
    }),
  };
});

describe('CustomCalender', () => {
  const mockOnChange = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    startDate: null,
    endDate: null,
    onChange: mockOnChange,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders correctly', () => {
    const { getByText } = render(<CustomCalender {...defaultProps} />);

    expect(getByText('Dates')).toBeTruthy();
    expect(getByText('Month')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  // ─────────────────────────────
  // CLOSE
  // ─────────────────────────────
  it('calls onClose when close button pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <CustomCalender {...defaultProps} />
    );

    const closeBtn = UNSAFE_getAllByType(require('../Buttons/CustomIconButton').default)[0];

    fireEvent.press(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // DATE SELECTION
  // ─────────────────────────────
  it('selects start and end date correctly', () => {
    const { getByText } = render(<CustomCalender {...defaultProps} />);

    fireEvent.press(getByText('Day1')); // start
    fireEvent.press(getByText('Day2')); // end

    fireEvent.press(getByText('Save'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: '2026-01-01',
      endDate: '2026-01-05',
    });
  });

  it('resets start if second date is earlier', () => {
    const { getByText } = render(<CustomCalender {...defaultProps} />);

    fireEvent.press(getByText('Day2')); // start
    fireEvent.press(getByText('Day1')); // earlier → reset

    fireEvent.press(getByText('Save'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: '2026-01-01',
      endDate: null,
    });
  });

  // ─────────────────────────────
  // RESET
  // ─────────────────────────────
  it('resets dates when Reset pressed', () => {
    const { getByText } = render(<CustomCalender {...defaultProps} />);

    fireEvent.press(getByText('Day1'));
    fireEvent.press(getByText('Reset'));

    fireEvent.press(getByText('Save'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: null,
    });
  });

  // ─────────────────────────────
  // READ ONLY
  // ─────────────────────────────
  it('does not allow selection in readOnly mode', () => {
    const { getByText } = render(
      <CustomCalender {...defaultProps} readOnly />
    );

    fireEvent.press(getByText('Day1'));
    fireEvent.press(getByText('Save'));

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: null,
      endDate: null,
    });
  });

  it('shows only Close button in readOnly mode', () => {
    const { getByText, queryByText } = render(
      <CustomCalender {...defaultProps} readOnly />
    );

    expect(getByText('Close')).toBeTruthy();
    expect(queryByText('Save')).toBeNull();
  });
});