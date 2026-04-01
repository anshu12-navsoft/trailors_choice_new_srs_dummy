import reducer, { loginSuccess, logout } from '../../App/Redux/Slices/authSlice';

const initialState = { isLoggedIn: false, role: null };

describe('authSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('loginSuccess sets isLoggedIn and role', () => {
    const state = reducer(initialState, loginSuccess({ role: 'owner' }));
    expect(state.isLoggedIn).toBe(true);
    expect(state.role).toBe('owner');
  });

  it('loginSuccess defaults role to renter when not provided', () => {
    const state = reducer(initialState, loginSuccess({}));
    expect(state.role).toBe('renter');
  });

  it('logout resets state', () => {
    const loggedIn = { isLoggedIn: true, role: 'owner' };
    const state = reducer(loggedIn, logout());
    expect(state).toEqual(initialState);
  });
});
