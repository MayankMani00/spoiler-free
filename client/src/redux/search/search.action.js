import SearchActionTypes from './search.types';

export const setSearchResult = (search) => ({
	type    : 'SET_SEARCH_RESULT',
	payload : search
});

export const fetchSearchResultStart = () => ({
	type : SearchActionTypes.SET_SEARCH_RESULT
});

export const fetchSearchResultSuccess = (collectionsMap) => ({
	type    : SearchActionTypes.FETCH_COLLECTIONS_SUCCESS,
	payload : collectionsMap
});

export const fetchSearchResultFailure = (errorMessage) => ({
	type    : SearchActionTypes.FETCH_COLLECTIONS_FAILURE,
	payload : errorMessage
});

export const setQuery = (query) => ({
	type    : SearchActionTypes.SET_QUERY,
	payload : query
});
