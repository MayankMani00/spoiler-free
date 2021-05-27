import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { connect } from 'react-redux';
import opensocket from 'socket.io-client';

import './RoomChat.css';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Notification from '../Notification/Notification';
import Spinner from '../Spinner/Spinner';

const MessageTypingArea = ({ socket, username, roomId, sendError }) => {
	const [
		newMessage,
		setNewMessage
	] = useState('');
	const handleSubmit = (e) => {
		// const msg = e.target[0].value;
		const msg = newMessage;
		if (!!msg) {
			socket.emit('chat-message', {
				username : username,
				msg      : msg,
				roomId   : roomId
			});
			// console.log('emitted');
			setNewMessage('');
		} else {
			sendError("Message can't be empty");
		}
	};
	return (
		<form
			className="input-area"
			onSubmit={(e) => {
				e.preventDefault();
				// console.log(newMessage);
				handleSubmit();
			}}
		>
			<TextField
				autoFocus
				margin="dense"
				id="newMessage"
				multiline
				placeholder="Type your message here"
				type="text"
				onChange={(e) => {
					setNewMessage(e.target.value);
				}}
				value={newMessage}
				style={{ width: '80%', color: 'white !important' }}
			/>
			<Button
				style={{
					position    : 'absolute',
					bottom      : '5px',
					right       : '1rem',
					color       : 'white',
					borderColor : 'white'
				}}
				type="submit"
			>
				Send
			</Button>
		</form>
	);
};

const RoomChat = ({ username, room, socket }) => {
	const [
		messages,
		setMessages
	] = useState([]);

	const [
		notificationMessage,
		setNotificationMessage
	] = useState('');

	const getHistory = async (room) => {
		// console.log(room);
		try {
			const res = await axios({
				method : 'post',
				url    : '/getChatHistory',
				data   : { room: room.id }
			});
			const data = await res.data;
			// console.log(res, data);
			setMessages(data.messages);
		} catch (e) {
			setNotificationMessage(e.response.data.message);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
		}
	};
	useEffect(() => {
		//establish socket connection here
		if (!!room) {
			const roomReq = {
				title : room.title,
				id    : room.id
			};
			socket.emit(
				'join',
				{ username, roomReq, joined: true },
				(error) => {
					if (error) {
						alert(error);
					}
				}
			);
		}
		try {
			getHistory(room);
		} catch (e) {
			setNotificationMessage(e.response.data.message);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
		}
	}, []);

	socket.on('chat-message', (data) => {
		// console.log('recieved', data);
		setMessages([
			...messages,
			data
		]);
	});

	// console.log(room, username);
	return (
		<div className="roomchat-container">
			<div className="messages-scroller">
				<div className="messages-container">
					{messages.length !== 0 &&
						messages.map((item, index) => (
							<div className="message" key={index}>
								<p
									className="name"
									style={{
										color :
											item.sentBy === username
												? 'red'
												: ''
									}}
								>
									{item.sentBy}
								</p>
								<p>{` : ${item.body}`}</p>
							</div>
						))}
				</div>
			</div>
			<MessageTypingArea
				socket={socket}
				username={username}
				roomId={room.id}
				sendError={setNotificationMessage}
			/>
			{!!notificationMessage && (
				<Notification message={notificationMessage} />
			)}
		</div>
	);
};

const RoomContainer = (props) => {
	// console.log(window.location.hostname, window.location.host);
	const [
		socket,
		setSocket
	] = useState(opensocket());
	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	});
	if (!!!socket) return <Spinner />;
	return (
		<React.Fragment>
			<RoomChat key={1} socket={socket} {...props} />
		</React.Fragment>
	);
};

const mapStateToProps = (state) => ({
	username : state.user.username
});

export default connect(mapStateToProps, null)(RoomContainer);
