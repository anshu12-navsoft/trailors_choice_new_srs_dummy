import reducer, {
  loginUser,
  logoutUser,
  loadUserFromStorage,
  clearError,
  loginSuccess,
  logout,
} from '../../App/Redux/Slices/authSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../../services/auth.api';

// ─────────────────────────────
// MOCKS
// ─────────────────────────────
jest.mock('../../services/auth.api');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

describe('authSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // LOGIN SUCCESS
  // ─────────────────────────────
  it('should login successfully and store token', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', name: 'Anshu' },
        token: 'test_token',
      },
    };

    loginApi.mockResolvedValueOnce(mockResponse);

    const dispatch = jest.fn();
    const thunk = loginUser({ email: 'test', password: '123' });

    const result = await thunk(dispatch, () => ({}), null);

    expect(loginApi).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'ACCESS_TOKEN',
      'test_token'
    );

    expect(result.payload).toEqual({
      user: mockResponse.data.user,
      token: mockResponse.data.token,
    });

    const state = reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: result.payload,
    });

    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual(mockResponse.data.user);
    expect(state.token).toBe('test_token');
  });

  // ─────────────────────────────
  // LOGIN FAILURE
  // ─────────────────────────────
  it('should handle login failure', async () => {
    loginApi.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    const dispatch = jest.fn();
    const thunk = loginUser({ email: 'wrong', password: 'wrong' });

    const result = await thunk(dispatch, () => ({}), null);

    expect(result.payload).toBe('Invalid credentials');

    const state = reducer(initialState, {
      type: loginUser.rejected.type,
      payload: result.payload,
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
  });

  // ─────────────────────────────
  // LOGOUT
  // ─────────────────────────────
  it('should logout and clear storage', async () => {
    const dispatch = jest.fn();
    const thunk = logoutUser();

    await thunk(dispatch, () => ({}), null);

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('ACCESS_TOKEN');

    const state = reducer(
      {
        ...initialState,
        isLoggedIn: true,
        token: 'abc',
        user: { id: 1 },
      },
      { type: logoutUser.fulfilled.type }
    );

    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  // ─────────────────────────────
  // AUTO LOGIN SUCCESS
  // ─────────────────────────────
  it('should load token from storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('stored_token');

    const dispatch = jest.fn();
    const thunk = loadUserFromStorage();

    const result = await thunk(dispatch, () => ({}), null);

    const state = reducer(initialState, {
      type: loadUserFromStorage.fulfilled.type,
      payload: result.payload,
    });

    expect(state.isLoggedIn).toBe(true);
    expect(state.token).toBe('stored_token');
  });

  // ─────────────────────────────
  // AUTO LOGIN NO TOKEN
  // ─────────────────────────────
  it('should not login if no token in storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const dispatch = jest.fn();
    const thunk = loadUserFromStorage();

    const result = await thunk(dispatch, () => ({}), null);

    const state = reducer(initialState, {
      type: loadUserFromStorage.fulfilled.type,
      payload: result.payload,
    });

    expect(state.isLoggedIn).toBe(false);
    expect(state.token).toBeNull();
  });

  // ─────────────────────────────
  // REDUCERS
  // ─────────────────────────────
  it('should clear error', () => {
    const state = reducer(
      { ...initialState, error: 'Some error' },
      clearError()
    );

    expect(state.error).toBeNull();
  });

  it('should set loginSuccess', () => {
    const state = reducer(initialState, loginSuccess());

    expect(state.isLoggedIn).toBe(true);
  });

  it('should reset state on logout reducer', () => {
    const state = reducer(
      {
        ...initialState,
        isLoggedIn: true,
        user: { id: 1 },
        token: 'abc',
      },
      logout()
    );

    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});