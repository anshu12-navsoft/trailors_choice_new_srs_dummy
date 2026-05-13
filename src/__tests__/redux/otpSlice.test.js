import reducer, {
  sendOtp,
  verifyOtp,
  resetOtp,
  clearOtpError,
} from '../../App/Redux/Slices/otpSlice';

import {
  sendOtpApi,
  verifyOtpApi,
} from '../../services/auth.api';

// ─────────────────────────────
// MOCKS
// ─────────────────────────────
jest.mock('../../services/auth.api', () => ({
  sendOtpApi: jest.fn(),
  verifyOtpApi: jest.fn(),
}));

// ─────────────────────────────
// INITIAL STATE HELPER
// ─────────────────────────────
const getInitialState = () =>
  reducer(undefined, { type: '@@INIT' });

describe('otpSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // SEND OTP
  // ─────────────────────────────

  it('should handle sendOtp success', async () => {
    sendOtpApi.mockResolvedValueOnce({
      data: { isNewUser: true },
    });

    const result = await sendOtp({ phoneNumber: '+1234567890' })(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: sendOtp.fulfilled.type,
      payload: result.payload,
    });

    expect(sendOtpApi).toHaveBeenCalledWith({
      phoneNumber: '+1234567890',
    });

    expect(state.otpSent).toBe(true);
    expect(state.phoneNumber).toBe('+1234567890');
    expect(state.isNewUser).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('should handle sendOtp failure', async () => {
    sendOtpApi.mockRejectedValueOnce({
      response: { data: { message: 'OTP failed' } },
    });

    const result = await sendOtp({ phoneNumber: '+123' })(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: sendOtp.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('OTP failed');
    expect(state.loading).toBe(false);
  });

  // ─────────────────────────────
  // VERIFY OTP
  // ─────────────────────────────

  it('should verify OTP for existing user', async () => {
    verifyOtpApi.mockResolvedValueOnce({
      data: { isNewUser: false, token: 'jwt_token' },
    });

    const result = await verifyOtp({
      phoneNumber: '+1234567890',
      otp: '123456',
    })(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: verifyOtp.fulfilled.type,
      payload: result.payload,
    });

    expect(verifyOtpApi).toHaveBeenCalledWith({
      phoneNumber: '+1234567890',
      otp: '123456',
    });

    expect(state.otpVerified).toBe(true);
    expect(state.isNewUser).toBe(false);
    expect(state.loading).toBe(false);
  });

  it('should verify OTP for new user (no token)', async () => {
    verifyOtpApi.mockResolvedValueOnce({
      data: { isNewUser: true, token: null },
    });

    const result = await verifyOtp({
      phoneNumber: '+1234567890',
      otp: '123456',
    })(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: verifyOtp.fulfilled.type,
      payload: result.payload,
    });

    expect(state.otpVerified).toBe(true);
    expect(state.isNewUser).toBe(true);
  });

  it('should handle verifyOtp failure', async () => {
    verifyOtpApi.mockRejectedValueOnce({
      response: { data: { message: 'Invalid OTP' } },
    });

    const result = await verifyOtp({
      phoneNumber: '+123',
      otp: '000000',
    })(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: verifyOtp.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Invalid OTP');
    expect(state.loading).toBe(false);
  });

  // ─────────────────────────────
  // REDUCERS
  // ─────────────────────────────

  it('should reset OTP state', () => {
    const modified = {
      ...getInitialState(),
      phoneNumber: '+123',
      otpSent: true,
      otpVerified: true,
      error: 'error',
    };

    const state = reducer(modified, resetOtp());

    expect(state).toEqual(getInitialState());
  });

  it('should clear error', () => {
    const state = reducer(
      { ...getInitialState(), error: 'Some error' },
      clearOtpError()
    );

    expect(state.error).toBeNull();
  });

  // ─────────────────────────────
  // LOADING STATES
  // ─────────────────────────────

  it('should set loading on sendOtp pending', () => {
    const state = reducer(getInitialState(), {
      type: sendOtp.pending.type,
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set loading on verifyOtp pending', () => {
    const state = reducer(getInitialState(), {
      type: verifyOtp.pending.type,
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});