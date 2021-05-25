import React, { useState } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { userAddRoom } from '../../redux/user/user.action';

import Button from '@material-ui/core/Button';
import Notification from '../Notification/Notification';

const JoinButton = ({ username, addRoom, target, rooms }) => {
	const [
		notificationMessage,
		setNotificationMessage
	] = useState();
	const handleClick = async (target) => {
		const found = rooms.find((el) => el.id == target.id);
		if (!!found) {
			setNotificationMessage('You are already in this room!');
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		} else {
			addRoom(target);
			// console.log('target', target);
			try {
				const res = await axios({
					method : 'post',
					url    : '/joinRoom',
					data   : { username: username, room: target }
				});
			} catch (e) {
				setNotificationMessage(e.response.data.message);
				setTimeout(() => {
					setNotificationMessage(null);
				}, 5000);
			}
		}
	};
	if (!!notificationMessage)
		return <Notification message={notificationMessage} />;
	return (
		<React.Fragment>
			<Button
				onClick={() => {
					handleClick(target);
				}}
			>
				Join
			</Button>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	username : state.user.username,
	rooms    : state.user.rooms
});

const mapDispatchToProps = (dispatch) => ({
	addRoom : (roomId) => dispatch(userAddRoom(roomId))
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinButton);
