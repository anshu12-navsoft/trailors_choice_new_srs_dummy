import reducer, {
  submitTrailer,
  updateTrailer,
  deleteTrailer,
  fetchMyTrailers,
  updateDraft,
  updateDraftSpecs,
  updateDraftFeatures,
  updateDraftPricing,
  toggleDraftTag,
  addMediaPhoto,
  addMediaVideo,
  addMediaDocument,
  resetDraft,
  clearMessages,
} from '../../App/Redux/Slices/addTrailerSlice';

import {
  addTrailerAPI,
  updateTrailerAPI,
  deleteTrailerAPI,
  fetchMyTrailersAPI,
} from '../../../Services/addTrailer.api';

// ─────────────────────────────
// MOCKS
// ─────────────────────────────
jest.mock('../../../Services/addTrailer.api', () => ({
  addTrailerAPI: jest.fn(),
  updateTrailerAPI: jest.fn(),
  deleteTrailerAPI: jest.fn(),
  fetchMyTrailersAPI: jest.fn(),
}));

// ─────────────────────────────
// HELPERS
// ─────────────────────────────
const getInitialState = () => reducer(undefined, { type: '@@INIT' });

describe('addTrailerSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // REDUCERS
  // ─────────────────────────────

  it('should update draft', () => {
    const state = reducer(
      getInitialState(),
      updateDraft({ makeModel: 'Test Trailer' })
    );

    expect(state.draft.makeModel).toBe('Test Trailer');
  });

  it('should update specs', () => {
    const state = reducer(
      getInitialState(),
      updateDraftSpecs({ length: '20' })
    );

    expect(state.draft.specs.length).toBe('20');
  });

  it('should update features', () => {
    const state = reducer(
      getInitialState(),
      updateDraftFeatures({ ramp: true })
    );

    expect(state.draft.features.ramp).toBe(true);
  });

  it('should update pricing', () => {
    const state = reducer(
      getInitialState(),
      updateDraftPricing({ daily: '100' })
    );

    expect(state.draft.pricing.daily).toBe('100');
  });

  it('should toggle tags (add/remove)', () => {
    let state = reducer(getInitialState(), toggleDraftTag('Ramp'));

    expect(state.draft.tags).toContain('Ramp');

    state = reducer(state, toggleDraftTag('Ramp'));

    expect(state.draft.tags).not.toContain('Ramp');
  });

  it('should add media (photos, videos, documents)', () => {
    let state = reducer(getInitialState(), addMediaPhoto(['p1.jpg']));
    state = reducer(state, addMediaVideo(['v1.mp4']));
    state = reducer(state, addMediaDocument(['d1.pdf']));

    expect(state.draft.mediaPhotos).toContain('p1.jpg');
    expect(state.draft.mediaVideos).toContain('v1.mp4');
    expect(state.draft.mediaDocuments).toContain('d1.pdf');
  });

  it('should reset draft', () => {
    const modified = reducer(
      getInitialState(),
      updateDraft({ makeModel: 'Modified' })
    );

    const reset = reducer(modified, resetDraft());

    expect(reset.draft.makeModel).toBe('');
  });

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

  // ─────────────────────────────
  // SUBMIT TRAILER
  // ─────────────────────────────

  it('should handle submitTrailer success', async () => {
    const mockData = { id: '1', name: 'Trailer' };

    addTrailerAPI.mockResolvedValueOnce({ data: mockData });

    const result = await submitTrailer({})(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: submitTrailer.fulfilled.type,
      payload: result.payload,
    });

    expect(addTrailerAPI).toHaveBeenCalled();
    expect(state.myTrailers[0]).toEqual(mockData);
    expect(state.successMessage).toBe('Trailer listed successfully!');
    expect(state.loading).toBe(false);
  });

  it('should handle submitTrailer failure', async () => {
    addTrailerAPI.mockRejectedValueOnce({
      response: { data: { message: 'Submit failed' } },
    });

    const result = await submitTrailer({})(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: submitTrailer.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Submit failed');
    expect(state.loading).toBe(false);
  });

  // ─────────────────────────────
  // UPDATE TRAILER
  // ─────────────────────────────

  it('should update trailer successfully', async () => {
    const existing = { id: '1', name: 'Old' };
    const updated = { id: '1', name: 'New' };

    updateTrailerAPI.mockResolvedValueOnce({ data: updated });

    const result = await updateTrailer({ id: '1', data: {} })(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(
      { ...getInitialState(), myTrailers: [existing] },
      {
        type: updateTrailer.fulfilled.type,
        payload: result.payload,
      }
    );

    expect(state.myTrailers[0]).toEqual(updated);
    expect(state.successMessage).toBe('Trailer updated successfully!');
  });

  it('should handle updateTrailer failure', async () => {
    updateTrailerAPI.mockRejectedValueOnce({
      response: { data: { message: 'Update failed' } },
    });

    const result = await updateTrailer({ id: '1', data: {} })(
      jest.fn(),
      () => ({}),
      null
    );

    const state = reducer(getInitialState(), {
      type: updateTrailer.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Update failed');
  });

  // ─────────────────────────────
  // DELETE TRAILER
  // ─────────────────────────────

  it('should delete trailer successfully', async () => {
    deleteTrailerAPI.mockResolvedValueOnce({});

    const result = await deleteTrailer('1')(jest.fn(), () => ({}), null);

    const state = reducer(
      {
        ...getInitialState(),
        myTrailers: [{ id: '1' }, { id: '2' }],
      },
      {
        type: deleteTrailer.fulfilled.type,
        payload: result.payload,
      }
    );

    expect(state.myTrailers).toEqual([{ id: '2' }]);
    expect(state.successMessage).toBe('Trailer deleted.');
  });

  it('should handle deleteTrailer failure', async () => {
    deleteTrailerAPI.mockRejectedValueOnce({
      response: { data: { message: 'Delete failed' } },
    });

    const result = await deleteTrailer('1')(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: deleteTrailer.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Delete failed');
  });

  // ─────────────────────────────
  // FETCH TRAILERS
  // ─────────────────────────────

  it('should fetch trailers successfully', async () => {
    const trailers = [{ id: '1' }];

    fetchMyTrailersAPI.mockResolvedValueOnce({ data: trailers });

    const result = await fetchMyTrailers()(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: fetchMyTrailers.fulfilled.type,
      payload: result.payload,
    });

    expect(state.myTrailers).toEqual(trailers);
  });

  it('should handle fetch trailers failure', async () => {
    fetchMyTrailersAPI.mockRejectedValueOnce({
      response: { data: { message: 'Fetch failed' } },
    });

    const result = await fetchMyTrailers()(jest.fn(), () => ({}), null);

    const state = reducer(getInitialState(), {
      type: fetchMyTrailers.rejected.type,
      payload: result.payload,
    });

    expect(state.error).toBe('Fetch failed');
  });
});