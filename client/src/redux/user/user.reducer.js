import UserActionTypes from './user.types';

const INITIAL_STATE = {
	username : '',
	loggedIn : false,
	openChat : false,
	rooms    : []
};

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UserActionTypes.TOGGLE_LOGIN:
			return {
				...state,
				loggedIn : !state.loggedIn
			};
		case UserActionTypes.TOGGLE_CHAT:
			return {
				...state,
				openChat : action.payload
			};
		case UserActionTypes.ADD_ROOM:
			return {
				...state,
				rooms : [
					action.payload,
					...state.rooms
				]
			};
		case UserActionTypes.INITIALIZE_ROOMS:
			return {
				...state,
				rooms : action.payload
			};
		case UserActionTypes.SET_USERNAME:
			return {
				...state,
				username : action.payload
			};
		default:
			return state;
	}
};

export default userReducer;
