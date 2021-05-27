import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';

import { connect } from 'react-redux';

import {
	initializeRooms,
	setUsername,
	userChatToggle,
	userLogToggle
} from '../../redux/user/user.action';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../theme';

import SearchBox from '../SearchBox/SearchBox';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ForumIcon from '@material-ui/icons/Forum';
import IconButton from '@material-ui/core/IconButton';

import Sidebar from '../Sidebar/Sidebar';
import Notification from '../Notification/Notification';

import Logo from './spoiler-free-logo.svg';

import './Navbar.css';

function isValid(str) {
	// console.log(str);
	var code, i, len;
	if (!str || str.length < 6) return 0;
	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (
			!(code > 47 && code < 58) &&
			!(code > 64 && code < 91) &&
			!(code > 96 && code < 123)
		)
			return 1;
	}
	if (str.charCodeAt(0) > 47 && str.charCodeAt(0) < 58) return 2;
	return 3;
}

const Navbar = ({
	loggedIn,
	userLogToggle,
	openChat,
	userChatToggle,
	initializeRooms,
	setUsername
}) => {
	const [
		openLogin,
		setOpenLogin
	] = useState(false);
	const [
		openSignup,
		setOpenSignup
	] = useState(false);
	// let username = '',
	// password = '',
	let cPassword = '';
	const [
		username,
		setUsernameState
	] = useState();
	const [
		password,
		setPasswordState
	] = useState();
	const [
		notificationMessage,
		setNotificationMessage
	] = useState('');

	useEffect(() => {
		// console.log('navbar mounted');
		const initialize = async () => {
			// axios.defaults.withCredentials = true;
			const res = await axios({
				method : 'get',
				url    : '/initialize'
			});
			const { data } = res;
			if (!!data.returned) {
				// console.log('here');
				setUsername(data.username);
				initializeRooms(data.rooms);
				userLogToggle(true);
			}
		};
		try {
			// console.log(Cookies.get('spoiler_free_access_token'));
			initialize();
		} catch (e) {
			console.log('error', e);
		}
		return () => {
			// console.log('navbar unmounted');
		};
	}, []);

	const handleSignupSubmit = async () => {
		if (isValid(username) !== 3) {
			const error = [
				'Username must be longer than 6 characters!',
				'Special characters are not allowed!',
				'Username must begin with an alphabet'
			];
			setNotificationMessage(error[isValid(username)]);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		}
		if (!password || password.length < 6) {
			setNotificationMessage(
				'Password must be longer than 6 characters!'
			);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		}
		if (password !== cPassword) {
			setNotificationMessage('Passwords do not match!');
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		}
		try {
			const res = await axios({
				method : 'post',
				url    : '/signup',
				data   : { username: username, password: password }
			});
			console.log(res);
			const { data } = res;
			// Cookies.set('spoiler_free_access_token', data.token, {
			// 	expires : 2
			// });
			initializeRooms(data.rooms);
			setUsername(username);
			// username = '';
			// password = '';
			setUsernameState('');
			setPasswordState('');
			userLogToggle(true);
			setOpenSignup(false);
		} catch (e) {
			console.log(e.message);
			setNotificationMessage(e.response.data.message);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
		}
	};
	const handleLoginSubmit = async () => {
		//starts here
		// console.log(username, password);
		//ends here
		if (isValid(username) !== 3) {
			const error = [
				'Username must be longer than 6 characters!',
				'Special characters are not allowed!',
				'Username must begin with an alphabet'
			];
			setNotificationMessage(error[isValid(username)]);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		}
		if (!password || password.length < 6) {
			setNotificationMessage(
				'Password must be longer than 6 characters!'
			);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
			return;
		}
		//set token in cookie

		try {
			// console.log('here');
			const res = await axios({
				method : 'post',
				url    : '/login',
				data   : { username: username, password: password }
			});
			// console.log(res);
			const { data } = res;
			// console.log(data);
			initializeRooms(data.rooms);
			setUsername(username);
			setUsernameState('');
			setPasswordState('');
			userLogToggle(true);
			setOpenLogin(false);
		} catch (e) {
			console.log(e, e.response.data.message);
			setNotificationMessage(e.response.data.message);
			setTimeout(() => {
				setNotificationMessage(null);
			}, 5000);
		}
	};
	const logout = () => {
		Cookies.remove('spoiler_free_access_token');
		initializeRooms([]);
		setUsername('');
		userChatToggle(false);
		userLogToggle(false);
	};
	return (
		<ThemeProvider theme={theme}>
			<AppBar position="sticky" color="secondary">
				<Toolbar className="navbar">
					<a
						style={{ textDecoration: 'none', color: 'white' }}
						href="/"
					>
						<img
							src={Logo}
							alt="Logo"
							style={{ maxHeight: '40px', maxWidth: '40px' }}
						/>
					</a>
					<SearchBox />
					{loggedIn ? (
						<div>
							<IconButton
								style={{ marginRight: '5px' }}
								onClick={() => {
									userChatToggle(!openChat);
								}}
							>
								<ForumIcon />
							</IconButton>
							<Button
								style={{ color: 'white', borderColor: 'white' }}
								onClick={() => {
									logout();
								}}
							>
								Logout
							</Button>
						</div>
					) : (
						<div>
							<Button
								variant="outlined"
								size="small"
								style={{
									marginRight : '5px',
									color       : 'white',
									borderColor : 'white'
								}}
								onClick={() => {
									setOpenLogin(true);
								}}
							>
								Login
							</Button>
							<Dialog
								open={openLogin}
								// onClose={() => {
								// 	setOpenLogin(false);
								// }}
								aria-labelledby="form-dialog-title"
							>
								<DialogTitle id="form-dialog-title">
									Login
								</DialogTitle>
								<DialogContent>
									<form>
										<TextField
											autoFocus
											autoComplete="off"
											margin="dense"
											id="username"
											label="Username"
											type="text"
											fullWidth
											value={username}
											onChange={(e) => {
												// username = e.target.value;
												setUsernameState(
													e.target.value
												);
											}}
										/>
										<TextField
											autoComplete="off"
											margin="dense"
											id="password"
											label="Password"
											type="password"
											value={password}
											onChange={(e) => {
												// password = e.target.value;
												setPasswordState(
													e.target.value
												);
											}}
											fullWidth
										/>
									</form>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={() => {
											setOpenLogin(false);
										}}
										color="primary"
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											handleLoginSubmit();
										}}
										color="primary"
									>
										Login
									</Button>
								</DialogActions>
							</Dialog>
							<Button
								variant="outlined"
								size="small"
								onClick={() => {
									setOpenSignup(true);
								}}
								style={{
									color       : 'white',
									borderColor : 'white'
								}}
							>
								Signup
							</Button>
							<Dialog
								open={openSignup}
								// onClose={() => {
								// 	setOpenLogin(false);
								// }}
								aria-labelledby="form-dialog-title"
							>
								<DialogTitle id="form-dialog-title">
									Sign Up
								</DialogTitle>
								<DialogContent>
									<form>
										<TextField
											autoFocus
											autoComplete="off"
											margin="dense"
											id="username"
											label="Username"
											type="text"
											fullWidth
											value={username}
											onChange={(e) => {
												setUsernameState(
													e.target.value
												);
											}}
										/>
										<TextField
											autoComplete="off"
											margin="dense"
											id="password"
											label="Password"
											type="password"
											value={password}
											onChange={(e) => {
												setPasswordState(
													e.target.value
												);
											}}
											fullWidth
										/>
										<TextField
											autoComplete="off"
											margin="dense"
											id="cpassword"
											label="Confirm Password"
											type="password"
											value={cPassword}
											onChange={(e) => {
												cPassword = e.target.value;
											}}
											fullWidth
										/>
									</form>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={() => {
											setOpenSignup(false);
										}}
										color="primary"
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											handleSignupSubmit();
										}}
										color="primary"
									>
										Sign Up
									</Button>
								</DialogActions>
							</Dialog>
						</div>
					)}
				</Toolbar>
			</AppBar>
			{openChat && <Sidebar />}
			{!!notificationMessage && (
				<Notification message={notificationMessage} />
			)}
		</ThemeProvider>
	);
};

const mapStateToProps = (state) => ({
	loggedIn : state.user.loggedIn,
	openChat : state.user.openChat
});

const mapDispatchToProps = (dispatch) => ({
	userLogToggle   : () => dispatch(userLogToggle()),
	userChatToggle  : (value) => dispatch(userChatToggle(value)),
	initializeRooms : (roomList) => dispatch(initializeRooms(roomList)),
	setUsername     : (username) => dispatch(setUsername(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
