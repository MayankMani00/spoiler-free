const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const { response } = require('express');
const cookieParser = require('cookie-parser');
const db = require('./models');
var jwt = require('jsonwebtoken');

const auth = require('./auth');
// const compression = require('compression');
// const enforce = require('express-sslify');

// parse application/json
// if (process.env.NODE_ENV !== 'production')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(enforce.HTTPS({ trustProtoHeader: true }));
// app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header(
		'Access-Control-Allow-Methods',
		'PUT, GET, POST, DELETE, OPTIONS'
	);
	// res.setHeader('Access-Control-Allow-Credentials', true);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});
// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/robots.txt', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/build', 'robots.txt'));
});

app.listen(port, (error) => {
	if (error) throw error;
	console.log('Server running on port ' + port);
});

app.post('/login', auth.login);
app.post('/signup', auth.signup);
app.post('/search', (req, res) => {
	let q = req.body.query;
	q = q.replace(/\s+/g, '+');
	const result = {
		books  : '',
		shows  : '',
		movies : ''
	};

	const getData = async () => {
		let bookResponse = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process
				.env.GBOOKS_API_KEY}`
		);
		if (!bookResponse.ok) {
			const message = `An error has occured: ${bookResponse.status}`;
			throw new Error(message);
		}
		let bookJson = await bookResponse.json();
		result.books = bookJson;

		let showsResponse = await fetch(
			`https://api.tvmaze.com/search/shows?q=${q}`
		);
		if (!showsResponse.ok) {
			const message = `An error has occured: ${showsResponse.status}`;
			throw new Error(message);
		}
		let showsJson = await showsResponse.json();
		result.shows = showsJson;

		let moviesResponse = await fetch(
			`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${q}`
		);
		if (!moviesResponse.ok) {
			const message = `An error has occured: ${moviesResponse.status}`;
			throw new Error(message);
		}
		let moviesJson = await moviesResponse.json();
		result.movies = moviesJson;
		console.log(result.movies);
		res.send(result);
	};

	getData();
});

app.post('/getMovie', (req, res) => {
	const id = req.body.id;
	fetch(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}`)
		.then((res) => res.json())
		.then((data) => {
			res.send(data);
		});
});

const getChatHistory = async (req, res, next) => {
	try {
		var verified = jwt.verify(token, process.env.SECRET_KEY);
	} catch (e) {
		res.status(400).send({ message: 'Invalid login!' });
	}
	try {
		let roomReqId = req.body.room;
		let room = await db.Room.findOne({ id: roomReqId });
		// if (room.length == 0) {
		// 	let username = req.body.username;
		// 	room = await db.Room.create({
		// 		title    : roomReq.title,
		// 		id       : roomReq.Id,
		// 		users    : [
		// 			username
		// 		],
		// 		messages : []
		// 	});
		// }
		// console.log('sent history: ', room);
		res.status(200).send(room);
	} catch (e) {
		return next({ status: 400, message: e.message });
	}
};

app.post('/getChatHistory', getChatHistory);

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// const socketio = require('socket.io');

// const httpServer = createServer();
const io = new Server(server, {
	cors    : 'https://localhost:3000',
	methods : [
		'GET',
		'POST'
	]
});

server.listen(4000, () => {
	console.log('running on port 4000');
});

const initialize = async (req, res) => {
	try {
		var token = req.cookies.spoiler_free_access_token;
		// console.log(req.cookies, token);
		var verified = jwt.verify(token, process.env.SECRET_KEY);
		const username = verified.username;
		let user = await db.User.findOne({
			username : username
		});
		// console.log(verified);
		const { rooms } = user;
		res
			.status(200)
			.send({ returned: true, username: username, rooms: rooms });
	} catch (e) {
		// console.log(e.message);
		res.status(400).send({
			returned : false,
			message  : `An error occured: ${e.message}`
		});
	}
};

app.get('/initialize', initialize);

const joinRoom = async (room, username, joined = false) => {
	// console.log('room', room);
	try {
		let roomReq = await db.Room.findOne({ id: room.id });
		if (!!!roomReq || roomReq.length == 0) {
			roomReq = await db.Room.create({
				title    : room.title,
				id       : room.id,
				users    : [
					username
				],
				messages : []
			});
			joined = true;
		}
		// console.log(roomReq);
		if (!joined) roomReq.users.push(username);
		db.User.findOneAndUpdate(
			{ username: username },
			{
				$push : {
					rooms : {
						$each     : [
							roomReq
						],
						$position : 0
					}
				}
			},
			function(err, success) {
				if (err) console.log(err);
				else console.log(success);
			}
		);
		return 1;
	} catch (e) {
		return e;
	}
};

app.post('/joinRoom', (req, res) => {
	try {
		var verified = jwt.verify(token, process.env.SECRET_KEY);
	} catch (e) {
		res.status(400).send({ message: 'Invalid login!' });
	}
	let { room, username } = req.body;
	// console.log(room);
	try {
		joinRoom(room, username, false);
		res.status(200).send({ message: 'ok' });
	} catch (e) {
		res.status(400).send({ message: 'An error occurred!' });
	}
});

app.get('/logout', (req, res) => {
	// console.log('logged out');
	res.cookie('spoiler_free_access_token', '', {
		expires   : new Date(0),
		overwrite : true
	});
	res.status(200);
});

io.on('connection', (socket) => {
	// console.log('a user connected');
	var username, room, roomReq;

	socket.on('join', (options) => {
		username = options.username;
		room = options.roomReq;
		joined = options.joined;
		// console.log(room);
		roomReq = joinRoom(room, username, joined);
		// console.log('joined ' + room);
		socket.join(room.id);
		// console.log(typeof room.id);
		// io.in(room).emit('newUserJoined', { msg: `${username} has joined` });
	});

	socket.on('chat-message', (msg) => {
		const send = async ({ username, msg, roomId }) => {
			// console.log('chat-msg', roomReq);
			let current = new Date();
			let cDate =
				current.getDate() +
				'-' +
				(current.getMonth() + 1) +
				'-' +
				current.getFullYear();
			let cTime =
				current.getHours() +
				':' +
				current.getMinutes() +
				':' +
				current.getSeconds();
			let dateTime = cDate + ' ' + cTime;
			const message = {
				sentTo : roomId,
				sentBy : username,
				body   : msg,
				sentAt : dateTime
			};
			// console.log('type: ', typeof roomId);
			io.to(roomId).emit('chat-message', message);
			// let room = await db.Room.findOne({ id: roomId });
			// await room.messages.push(message);
			db.Room.findOneAndUpdate(
				{ id: roomId },
				{ $push: { messages: message } },
				function(err, success) {
					if (err) console.log(err);
					else console.log(success);
				}
			);
		};
		send(msg);
	});

	socket.on('disconnect', () => {
		// console.log('a user disconnected');
	});
});
