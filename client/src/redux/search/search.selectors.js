import { createSelector } from 'reselect';

export const selectSearch = (state) => state.search;

export const selectIsSearchResultFetching = createSelector(
	[
		selectSearch
	],
	(search) => search.isLoading
);
