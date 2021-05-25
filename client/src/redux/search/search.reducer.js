import SearchActionTypes from './search.types';

const INITIAL_STATE = {
	searchResult : null,
	isFetching   : false,
	errorMessage : undefined
};

const searchReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SearchActionTypes.SET_QUERY:
			return {
				...state,
				query : action.payload
			};
		case SearchActionTypes.SET_SEARCH_RESULT:
			return {
				...state,
				searchResult : action.payload
			};
		case SearchActionTypes.FETCH_SEARCH_RESULT_START:
			return {
				...state,
				isFetching : true
			};
		case SearchActionTypes.FETCH_SEARCH_RESULT_SUCCESS:
			return {
				...state,
				isFetching   : false,
				searchResult : action.payload
			};
		case SearchActionTypes.FETCH_SEARCH_RESULT_FAILURE:
			return {
				...state,
				isFetching   : false,
				errorMessage : action.payload
			};
		default:
			return state;
	}
};

export default searchReducer;
