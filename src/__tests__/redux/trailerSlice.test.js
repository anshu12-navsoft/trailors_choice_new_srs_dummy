import reducer, {
  setSearchQuery,
  setSearchLocation,
  setSearchRadius,
  setFilters,
  resetFilters,
  setSortBy,
  setSelectedTrailer,
  setListings,
  setFeaturedListings,
  toggleFavorite,
  setLoading,
  setError,
  searchTrailers,
  fetchFeaturedListings,
} from '../../App/Redux/Slices/trailerSlice';

const defaultFilters = {
  category: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  instantBook: false,
};

const initialState = {
  searchQuery: '',
  searchLocation: '',
  searchRadius: 25,
  filters: defaultFilters,
  sortBy: 'relevance',
  listings: [],
  featuredListings: [],
  selectedTrailer: null,
  favorites: [],
  loading: false,
  error: null,
};

describe('trailerSlice — reducers', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setSearchQuery updates searchQuery', () => {
    const state = reducer(initialState, setSearchQuery('Austin'));
    expect(state.searchQuery).toBe('Austin');
  });

  it('setSearchLocation updates searchLocation', () => {
    const state = reducer(initialState, setSearchLocation('TX'));
    expect(state.searchLocation).toBe('TX');
  });

  it('setSearchRadius updates searchRadius', () => {
    const state = reducer(initialState, setSearchRadius(50));
    expect(state.searchRadius).toBe(50);
  });

  it('setFilters merges partial filter update', () => {
    const state = reducer(initialState, setFilters({ category: 'Utility', instantBook: true }));
    expect(state.filters.category).toBe('Utility');
    expect(state.filters.instantBook).toBe(true);
    expect(state.filters.minPrice).toBeNull(); // untouched
  });

  it('resetFilters restores defaults', () => {
    const withFilters = reducer(initialState, setFilters({ category: 'Boat', minRating: 4 }));
    const reset = reducer(withFilters, resetFilters());
    expect(reset.filters).toEqual(defaultFilters);
  });

  it('setSortBy updates sortBy', () => {
    const state = reducer(initialState, setSortBy('price_asc'));
    expect(state.sortBy).toBe('price_asc');
  });

  it('setSelectedTrailer stores trailer object', () => {
    const trailer = { id: '1', title: 'Test' };
    const state = reducer(initialState, setSelectedTrailer(trailer));
    expect(state.selectedTrailer).toEqual(trailer);
  });

  it('setListings replaces listings array', () => {
    const listings = [{ id: '1' }, { id: '2' }];
    const state = reducer(initialState, setListings(listings));
    expect(state.listings).toEqual(listings);
  });

  it('setFeaturedListings replaces featuredListings array', () => {
    const featured = [{ id: 'f1' }];
    const state = reducer(initialState, setFeaturedListings(featured));
    expect(state.featuredListings).toEqual(featured);
  });

  it('setLoading / setError update flags', () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
    state = reducer(state, setError('oops'));
    expect(state.error).toBe('oops');
  });
});

describe('trailerSlice — toggleFavorite', () => {
  it('adds id to favorites when not present', () => {
    const state = reducer(initialState, toggleFavorite('abc'));
    expect(state.favorites).toContain('abc');
  });

  it('removes id from favorites when already present', () => {
    const withFav = { ...initialState, favorites: ['abc', 'xyz'] };
    const state = reducer(withFav, toggleFavorite('abc'));
    expect(state.favorites).not.toContain('abc');
    expect(state.favorites).toContain('xyz');
  });

  it('toggling same id twice returns to original state', () => {
    let state = reducer(initialState, toggleFavorite('abc'));
    state = reducer(state, toggleFavorite('abc'));
    expect(state.favorites).toHaveLength(0);
  });
});

describe('trailerSlice — async thunks (extraReducers)', () => {
  it('searchTrailers.pending sets loading true and clears error', () => {
    const state = reducer({ ...initialState, error: 'old' }, searchTrailers.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('searchTrailers.fulfilled sets listings and loading false', () => {
    const listings = [{ id: '1' }];
    const state = reducer(initialState, searchTrailers.fulfilled(listings));
    expect(state.loading).toBe(false);
    expect(state.listings).toEqual(listings);
  });

  it('searchTrailers.rejected sets error and loading false', () => {
    const state = reducer(initialState, searchTrailers.rejected(null, '', undefined, 'Search failed'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Search failed');
  });

  it('fetchFeaturedListings.pending sets loading true', () => {
    const state = reducer(initialState, fetchFeaturedListings.pending());
    expect(state.loading).toBe(true);
  });

  it('fetchFeaturedListings.fulfilled sets featuredListings', () => {
    const featured = [{ id: 'f1' }];
    const state = reducer(initialState, fetchFeaturedListings.fulfilled(featured));
    expect(state.featuredListings).toEqual(featured);
    expect(state.loading).toBe(false);
  });

  it('fetchFeaturedListings.rejected sets error', () => {
    const state = reducer(initialState, fetchFeaturedListings.rejected(null, '', undefined, 'Failed'));
    expect(state.error).toBe('Failed');
  });
});
