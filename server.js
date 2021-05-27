const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const db = require('./index');
var jwt = require('jsonwebtoken');

const auth = require('./auth');
const compression = require('compression');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Methods',
		'PUT, GET, POST, DELETE, OPTIONS'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/robots.txt', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/build', 'robots.txt'));
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
		try {
			let bookJson;
			try {
				let bookResponse = await fetch(
					`https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process
						.env.GBOOKS_API_KEY}`
				);
				if (!bookResponse.ok) {
					const message = `An error has occured: ${bookResponse.status}`;
					throw new Error(message);
				}
				bookJson = await bookResponse.json();
			} catch (e) {
				console.log('error', e);
				bookJson = {};
			}
			result.books = bookJson;

			let showsJson;
			try {
				let showsResponse = await fetch(
					`https://api.tvmaze.com/search/shows?q=${q}`
				);
				if (!showsResponse.ok) {
					const message = `An error has occured: ${showsResponse.status}`;
					console.log('here');
					throw new Error(message);
				}
				showsJson = await showsResponse.json();
			} catch (e) {
				console.log('error', e);
				showsJson = {};
			}
			result.shows = showsJson;

			let moviesJson;
			try {
				let moviesResponse = await fetch(
					`https://www.omdbapi.com/?apikey=${process.env
						.OMDB_API_KEY}&s=${q}`
				);
				if (!moviesResponse.ok) {
					const message = `An error has occured: ${moviesResponse.status}`;
					throw new Error(message);
				}
				moviesJson = await moviesResponse.json();
			} catch (e) {
				console.log('error', e);
				moviesJson = {};
			}
			result.movies = moviesJson;

			res.status(200).send(result);
		} catch (e) {
			res.status(400).send({ message: 'An error occurred :(' });
		}
	};

	getData();
});

app.post('/getMovie', (req, res) => {
	try {
		const id = req.body.id;
		fetch(
			`https://www.omdbapi.com/?apikey=${process.env
				.OMDB_API_KEY}&i=${id}`
		)
			.then((res) => res.json())
			.then((data) => {
				res.send(data);
			});
	} catch (e) {
		res.status(400).send({ message: 'An error occurred' });
	}
});

const getChatHistory = async (req, res, next) => {
	try {
		var token = req.cookies.spoiler_free_access_token;
		var verified = jwt.verify(token, process.env.SECRET_KEY);
	} catch (e) {
		res.status(400).send({ message: 'Invalid login!' });
	}
	try {
		let roomReqId = req.body.room;
		let room = await db.Room.findOne({ id: roomReqId });
		res.status(200).send(room);
	} catch (e) {
		return next({
			status  : 400,
			message : 'Error while loading chat history'
		});
	}
};

app.post('/getChatHistory', getChatHistory);

const initialize = async (req, res) => {
	try {
		var token = req.cookies.spoiler_free_access_token;
		var verified = jwt.verify(token, process.env.SECRET_KEY);
		const username = verified.username;
		let user = await db.User.findOne({
			username : username
		});
		const { rooms } = user;
		res
			.status(200)
			.send({ returned: true, username: username, rooms: rooms });
	} catch (e) {
		res.status(400).send({
			returned : false,
			message  : `An error occured: ${e.message}`
		});
	}
};

app.get('/initialize', initialize);

const joinRoom = async (room, username) => {
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
		roomReq.users.push(username);
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
			}
		);
		return 1;
	} catch (e) {
		return e;
	}
};

app.post('/joinRoom', (req, res) => {
	try {
		var token = req.cookies.spoiler_free_access_token;
		var verified = jwt.verify(token, process.env.SECRET_KEY);
	} catch (e) {
		res.status(400).send({ message: 'Invalid login!' });
	}
	let { room, username } = req.body;
	try {
		joinRoom(room, username);
		res.status(200).send({ message: 'ok' });
	} catch (e) {
		res.status(400).send({ message: 'An error occurred!' });
	}
});

app.get('/logout', (req, res) => {
	res.cookie('spoiler_free_access_token', '', {
		expires   : new Date(0),
		overwrite : true
	});
	res.status(200);
});

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
	cors    : [
		'https://localhost:3000',
		'https://spoilr-free.herokuapp.com/'
	],
	methods : [
		'GET',
		'POST'
	]
});

server.listen(port, () => {
	console.log(`running on port ${port}`);
});

io.on('connection', (socket) => {
	var username, room, roomReq;

	socket.on('join', (options) => {
		username = options.username;
		room = options.roomReq;
		joined = options.joined;
		if (!joined) roomReq = joinRoom(room, username);
		socket.join(room.id);
	});

	socket.on('chat-message', (msg) => {
		const send = async ({ username, msg, roomId }) => {
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
			io.to(roomId).emit('chat-message', message);
			try {
				db.Room.findOneAndUpdate(
					{ id: roomId },
					{ $push: { messages: message } },
					function(err, success) {
						if (err) console.log(err);
					}
				);
			} catch (e) {
				console.log(e.message);
			}
		};
		send(msg);
	});

	socket.on('disconnect', () => {});
});
