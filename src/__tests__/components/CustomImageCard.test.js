import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomImageCard from '../../Components/Card/CustomImageCards';
import { Card, IconButton } from 'react-native-paper';

// Mock scale
jest.mock('react-native-size-matters', () => ({
  moderateScale: v => v,
}));

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (key === 'per_day_label') return '/day';
      if (key === 'by_owner') return `by ${params.owner}`;
      return key;
    },
  }),
}));

// Mock theme
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    useTheme: () => ({
      colors: {
        success: '#16A34A',
        background: '#fff',
        onSurface: '#000',
        onSurfaceVariant: '#666',
        surfaceVariant: '#eee',
      },
    }),
  };
});

describe('CustomImageCard', () => {
  const props = {
    image: 'https://test.com/image.jpg',
    title: 'Test Trailer',
    location: 'New York',
    price: '100',
    description: 'Test description',
    rating: '4.5',
    owner: 'John',
    onPress: jest.fn(),
    onWishlistPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // RENDER
  // ─────────────────────────────
  it('renders all data correctly', () => {
    const { getByText } = render(<CustomImageCard {...props} />);

    expect(getByText('Test Trailer')).toBeTruthy();
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
    expect(getByText('/day')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('by John')).toBeTruthy();
  });

  // ─────────────────────────────
  // PRESS HANDLERS
  // ─────────────────────────────
  it('calls onPress when card is pressed', () => {
    const { UNSAFE_getByType } = render(<CustomImageCard {...props} />);

    const card = UNSAFE_getByType(Card);

    fireEvent.press(card);

    expect(props.onPress).toHaveBeenCalled();
  });

  it('calls onWishlistPress when wishlist button pressed', () => {
    const { UNSAFE_getByType } = render(<CustomImageCard {...props} />);

    const wishlistBtn = UNSAFE_getByType(IconButton);

    fireEvent.press(wishlistBtn);

    expect(props.onWishlistPress).toHaveBeenCalled();
  });

  // ─────────────────────────────
  // IMAGE
  // ─────────────────────────────
  it('renders image with correct uri', () => {
    const { UNSAFE_getAllByType } = render(<CustomImageCard {...props} />);

    const cover = UNSAFE_getAllByType(Card.Cover)[0];

    expect(cover.props.source).toEqual({ uri: props.image });
  });
});