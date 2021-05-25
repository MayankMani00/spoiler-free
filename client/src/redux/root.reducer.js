import { combineReducers } from 'redux';

import searchReducer from './search/search.reducer';
import userReducer from './user/user.reducer';

export default combineReducers({
	search : searchReducer,
	user   : userReducer
});
