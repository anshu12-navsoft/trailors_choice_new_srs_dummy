import reducer, {
  setBookingDraft,
  updateBookingDraft,
  clearBookingDraft,
  setSelectedBooking,
  setBookings,
  setLoading,
  setError,
  setSuccessMessage,
  clearMessages,
  createBooking,
  fetchMyBookings,
  cancelBooking,
  modifyBooking,
} from '../../App/Redux/Slices/bookingSlice';

const emptyDraft = {
  trailerId: null,
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  paymentMethodId: null,
  notes: '',
};

const initialState = {
  bookings: [],
  selectedBooking: null,
  bookingDraft: emptyDraft,
  loading: false,
  error: null,
  successMessage: null,
};

describe('bookingSlice — reducers', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setBookingDraft replaces the entire draft', () => {
    const draft = { ...emptyDraft, trailerId: '42', notes: 'handle with care' };
    const state = reducer(initialState, setBookingDraft(draft));
    expect(state.bookingDraft).toEqual(draft);
  });

  it('updateBookingDraft merges partial updates', () => {
    const state = reducer(initialState, updateBookingDraft({ trailerId: '7', notes: 'careful' }));
    expect(state.bookingDraft.trailerId).toBe('7');
    expect(state.bookingDraft.notes).toBe('careful');
    expect(state.bookingDraft.startDate).toBeNull(); // untouched
  });

  it('clearBookingDraft resets draft to empty', () => {
    const withDraft = reducer(initialState, updateBookingDraft({ trailerId: '7' }));
    const cleared = reducer(withDraft, clearBookingDraft());
    expect(cleared.bookingDraft).toEqual(emptyDraft);
  });

  it('setSelectedBooking stores booking', () => {
    const booking = { id: 'b1', status: 'confirmed' };
    const state = reducer(initialState, setSelectedBooking(booking));
    expect(state.selectedBooking).toEqual(booking);
  });

  it('setBookings replaces bookings array', () => {
    const bookings = [{ id: 'b1' }, { id: 'b2' }];
    const state = reducer(initialState, setBookings(bookings));
    expect(state.bookings).toEqual(bookings);
  });

  it('setLoading and setError update flags', () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
    state = reducer(state, setError('Something went wrong'));
    expect(state.error).toBe('Something went wrong');
  });

  it('setSuccessMessage stores message', () => {
    const state = reducer(initialState, setSuccessMessage('Done!'));
    expect(state.successMessage).toBe('Done!');
  });

  it('clearMessages resets error and successMessage', () => {
    const dirty = { ...initialState, error: 'err', successMessage: 'ok' };
    const state = reducer(dirty, clearMessages());
    expect(state.error).toBeNull();
    expect(state.successMessage).toBeNull();
  });
});

describe('bookingSlice — async thunks (extraReducers)', () => {
  it('createBooking.pending sets loading and clears error', () => {
    const state = reducer({ ...initialState, error: 'old' }, createBooking.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('createBooking.fulfilled prepends booking and sets successMessage', () => {
    const newBooking = { id: 'b99', status: 'confirmed' };
    const state = reducer(
      { ...initialState, bookings: [{ id: 'b1' }] },
      createBooking.fulfilled(newBooking),
    );
    expect(state.loading).toBe(false);
    expect(state.bookings[0]).toEqual(newBooking); // unshifted
    expect(state.successMessage).toBe('Booking confirmed!');
  });

  it('createBooking.rejected sets error', () => {
    const state = reducer(initialState, createBooking.rejected(null, '', undefined, 'Booking failed'));
    expect(state.error).toBe('Booking failed');
    expect(state.loading).toBe(false);
  });

  it('fetchMyBookings.fulfilled replaces bookings', () => {
    const bookings = [{ id: 'b1' }, { id: 'b2' }];
    const state = reducer(initialState, fetchMyBookings.fulfilled(bookings));
    expect(state.bookings).toEqual(bookings);
  });

  it('cancelBooking.fulfilled marks booking as cancelled', () => {
    const existing = [{ id: 'b1', status: 'confirmed' }, { id: 'b2', status: 'confirmed' }];
    const state = reducer(
      { ...initialState, bookings: existing },
      cancelBooking.fulfilled({ bookingId: 'b1' }),
    );
    expect(state.bookings.find(b => b.id === 'b1').status).toBe('cancelled');
    expect(state.bookings.find(b => b.id === 'b2').status).toBe('confirmed'); // untouched
    expect(state.successMessage).toBe('Booking cancelled.');
  });

  it('modifyBooking.fulfilled replaces the updated booking in list', () => {
    const existing = [{ id: 'b1', notes: 'old' }, { id: 'b2', notes: 'keep' }];
    const updated = { id: 'b1', notes: 'new note' };
    const state = reducer(
      { ...initialState, bookings: existing },
      modifyBooking.fulfilled(updated),
    );
    expect(state.bookings.find(b => b.id === 'b1').notes).toBe('new note');
    expect(state.successMessage).toBe('Booking updated.');
  });
});
