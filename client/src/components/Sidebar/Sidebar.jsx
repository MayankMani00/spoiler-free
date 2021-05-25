import React, { useState } from 'react';

import RoomChat from './RoomChat';

import { connect } from 'react-redux';
import { userChatToggle } from '../../redux/user/user.action';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CloseIcon from '@material-ui/icons/Close';

import './Sidebar.css';

const Sidebar = ({ rooms, userChatToggle }) => {
	// console.log(rooms);
	const [
		openRoomId,
		setOpenRoomId
	] = useState(-1);

	const handleClick = (room) => {
		setOpenRoomId(room);
	};

	return (
		<div className="chat-popup">
			<div className="chat-navbar">
				{openRoomId !== -1 && (
					<IconButton>
						<ArrowBackIosIcon
							style={{ color: 'white' }}
							onClick={() => {
								setOpenRoomId(-1);
							}}
						/>
					</IconButton>
				)}
				<IconButton
					onClick={() => {
						userChatToggle(false);
					}}
				>
					<CloseIcon style={{ color: 'white' }} />
				</IconButton>
			</div>
			{rooms.length === 0 && (
				<div style={{ padding: '1rem' }}>
					Join a room to get started!
				</div>
			)}
			{openRoomId === -1 ? (
				<ul className="room-list">
					{rooms.map((item) => (
						<React.Fragment>
							<li
								className="room-in-list"
								key={item.id}
								onClick={() => {
									handleClick(item);
								}}
							>
								{item.title}
							</li>
						</React.Fragment>
					))}
				</ul>
			) : (
				<RoomChat room={openRoomId} />
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	openChat : state.user.openChat,
	rooms    : state.user.rooms
});

const mapDispatchToProps = (dispatch) => ({
	userChatToggle : () => dispatch(userChatToggle())
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
