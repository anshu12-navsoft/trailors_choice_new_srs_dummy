import reducer, {
  fetchProfile,
  updateProfile,
  toggleWishlist,
  logoutProfile,
  clearMessages,
  clearProfile,
} from '../../App/Redux/Slices/profileSlice';

import {
  fetchProfileAPI,
  updateProfileAPI,
  toggleWishlistAPI,
} from '../../../Services/profile.api';

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────
// MOCKS
// ─────────────────────────────
jest.mock('../../../Services/profile.api', () => ({
  fetchProfileAPI: jest.fn(),
  updateProfileAPI: jest.fn(),
  toggleWishlistAPI: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

const getInitialState = () =>
  reducer(undefined, { type: '@@INIT' });

describe('profileSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // FETCH PROFILE
  // ─────────────────────────────

  it('should fetch profile successfully', async () => {
    const mockData = {
      user: { id: '1', firstName: 'John' },
      rentalHistory: [{ id: 'r1' }],
      wishlist: [{ id: 'w1' }],
    };

    fetchProfileAPI.mockResolvedValueOnce({ data: mockData });

    const result = await fetchProfile()(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: fetchProfile.fulfilled.type,
      payload: result.payload,
    });

    expect(state.user).toEqual(mockData.user);
    expect(state.rentalHistory).toEqual(mockData.rentalHistory);
    expect(state.wishlist).toEqual(mockData.wishlist);
    expect(state.loading).toBe(false);
  });

  it('should handle fetch profile failure', async () => {
    fetchProfileAPI.mockRejectedValueOnce({
      response: { data: { message: 'Fetch failed' } },
    });

    const result = await fetchProfile()(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: fetchProfile.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Fetch failed');
    expect(state.loading).toBe(false);
  });

  it('should set loading on fetch pending', () => {
    const state = reducer(getInitialState(), {
      type: fetchProfile.pending.type,
    });

    expect(state.loading).toBe(true);
  });

  // ─────────────────────────────
  // UPDATE PROFILE
  // ─────────────────────────────

  it('should update profile and merge user data', async () => {
    const existingState = {
      ...getInitialState(),
      user: { id: '1', firstName: 'Old', email: 'old@mail.com' },
    };

    const updatedData = { firstName: 'New' };

    updateProfileAPI.mockResolvedValueOnce({ data: updatedData });

    const result = await updateProfile({})(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(existingState, {
      type: updateProfile.fulfilled.type,
      payload: result.payload,
    });

    expect(state.user.firstName).toBe('New');
    expect(state.user.email).toBe('old@mail.com'); // preserved
    expect(state.successMessage).toBe('Profile updated successfully!');
    expect(state.updateLoading).toBe(false);
  });

  it('should handle update profile failure', async () => {
    updateProfileAPI.mockRejectedValueOnce({
      response: { data: { message: 'Update failed' } },
    });

    const result = await updateProfile({})(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: updateProfile.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Update failed');
    expect(state.updateLoading).toBe(false);
  });

  it('should set updateLoading on pending', () => {
    const state = reducer(getInitialState(), {
      type: updateProfile.pending.type,
    });

    expect(state.updateLoading).toBe(true);
  });

  // ─────────────────────────────
  // TOGGLE WISHLIST
  // ─────────────────────────────

  it('should add item to wishlist when saved=true', async () => {
    toggleWishlistAPI.mockResolvedValueOnce({
      data: { saved: true },
    });

    const result = await toggleWishlist('t1')(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: toggleWishlist.fulfilled.type,
      payload: result.payload,
    });

    expect(state.wishlist).toContainEqual({ id: 't1' });
  });

  it('should NOT duplicate wishlist item', async () => {
    toggleWishlistAPI.mockResolvedValueOnce({
      data: { saved: true },
    });

    const existingState = {
      ...getInitialState(),
      wishlist: [{ id: 't1' }],
    };

    const result = await toggleWishlist('t1')(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(existingState, {
      type: toggleWishlist.fulfilled.type,
      payload: result.payload,
    });

    expect(state.wishlist.length).toBe(1);
  });

  it('should remove item when saved=false', async () => {
    toggleWishlistAPI.mockResolvedValueOnce({
      data: { saved: false },
    });

    const existingState = {
      ...getInitialState(),
      wishlist: [{ id: 't1' }],
    };

    const result = await toggleWishlist('t1')(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(existingState, {
      type: toggleWishlist.fulfilled.type,
      payload: result.payload,
    });

    expect(state.wishlist).toEqual([]);
  });

  it('should handle toggle wishlist failure', async () => {
    toggleWishlistAPI.mockRejectedValueOnce({
      response: { data: { message: 'Wishlist failed' } },
    });

    const result = await toggleWishlist('t1')(
      jest.fn(),
      () => ({}),
      null
    );

    expect(result.payload).toBe('Wishlist failed');
  });

  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────

  it('should clear state on logout', async () => {
    const existingState = {
      ...getInitialState(),
      user: { id: '1' },
      wishlist: [{ id: 't1' }],
      rentalHistory: [{ id: 'r1' }],
      error: 'err',
      successMessage: 'ok',
    };

    const result = await logoutProfile()(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(existingState, {
      type: logoutProfile.fulfilled.type,
      payload: result.payload,
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('ACCESS_TOKEN');

    expect(state.user).toBeNull();
    expect(state.wishlist).toEqual([]);
    expect(state.rentalHistory).toEqual([]);
    expect(state.error).toBeNull();
    expect(state.successMessage).toBeNull();
  });

  // ─────────────────────────────
  // REDUCERS
  // ─────────────────────────────

  it('should clear messages', () => {
    const state = reducer(
      {
        ...getInitialState(),
        error: 'error',
        successMessage: 'success',
      },
      clearMessages()
    );

    expect(state.error).toBeNull();
    expect(state.successMessage).toBeNull();
  });

  it('should clear profile', () => {
    const state = reducer(
      {
        ...getInitialState(),
        user: { id: '1' },
        wishlist: [{ id: 't1' }],
        rentalHistory: [{ id: 'r1' }],
      },
      clearProfile()
    );

    expect(state.user).toBeNull();
    expect(state.wishlist).toEqual([]);
    expect(state.rentalHistory).toEqual([]);
  });
});