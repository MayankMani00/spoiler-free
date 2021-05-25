import UserActionTypes from './user.types';

export const userLogToggle = () => ({
	type : UserActionTypes.TOGGLE_LOGIN
});

export const userChatToggle = (value) => ({
	type    : UserActionTypes.TOGGLE_CHAT,
	payload : value
});

export const userAddRoom = (roomId) => ({
	type    : UserActionTypes.ADD_ROOM,
	payload : roomId
});

export const initializeRooms = (roomList) => ({
	type    : UserActionTypes.INITIALIZE_ROOMS,
	payload : roomList
});

export const setUsername = (username) => ({
	type    : UserActionTypes.SET_USERNAME,
	payload : username
});
