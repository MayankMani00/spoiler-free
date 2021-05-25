const db = require('./models');
var jwt = require('jsonwebtoken');

function isValid(str) {
	var code, i, len;
	if (str.length < 6) return 0;
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

const login = async (req, res, next) => {
	//console.log(req.cookies);
	//validate username & password
	try {
		console.log(req.cookies);
		let username = req.body.username;
		let password = req.body.password;
		// console.log()
		// console.log('recieved', username, password);
		if (isValid(username) !== 3) {
			//invalid username
			res.status(400).send({ message: 'Invalid username' });
			return res;
		}
		if (password.length < 6) {
			//invalid password
			res.status(400).send({ message: 'Password too short!' });
		}
		let user = await db.User.findOne({
			username : username
		});
		if (!!!user) {
			res.status(400).send({ message: 'Username not found' });
			return;
		}
		// console.log(user);
		let { _id } = user;
		let { rooms } = user;
		let isMatch = await user.comparePassword(password);
		if (isMatch) {
			let token = jwt.sign(
				{
					_id,
					username
				},
				process.env.SECRET_KEY
			);
			res.cookie('spoiler_free_access_token', token, {
				maxAge    : 900000,
				expires   : new Date(Date.now() + 900000),
				overwrite : true
			});
			// console.log('sent');
			res
				.status(200)
				.send({ username: username, token: token, rooms: rooms });
		} else {
			return res.status(400).send({
				message : 'Invalid Username/Password.'
			});
		}
	} catch (e) {
		return next({ status: 400, message: e.message });
	}
};

const signup = async (req, res, next) => {
	try {
		let username = req.body.username;
		let password = req.body.password;

		if (isValid(username) !== 3) {
			//invalid username
			res.status(400).send({ message: 'Invalid username' });
			return res;
		}
		if (password.length < 6) {
			//invalid password
			res.status(400).send({ message: 'Password too short!' });
		}
		let foundUsername = await db.User.find({ username: username });
		// console.log(foundUsername);

		if (foundUsername.length === 0) {
			let user = await db.User.create(req.body);
			let { _id } = user;

			// console.log(user);
			let token = jwt.sign(
				{
					_id,
					username
				},
				process.env.SECRET_KEY
			);
			// console.log(username);
			res.cookie('spoiler_free_access_token', token, {
				maxAge    : 900000,
				expires   : new Date(Date.now() + 900000),
				overwrite : true
			});
			res
				.status(200)
				.send({ username: username, token: token, rooms: [] });
		} else {
			res.status(406).send({ message: 'Sorry, that username is taken' });
		}
	} catch (err) {
		if (err.code === 11000) {
			err.message = 'Sorry, that username is taken';
		}
		// console.log('here');
		return res.status(406).send({
			message : err.message
		});
	}
};

const auth = { login: login, signup: signup };
module.exports = auth;
