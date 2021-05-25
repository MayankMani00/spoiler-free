const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('debug', true);
mongoose.Promise = Promise;
console.log({
	MONGO_URI: process.env.MONGO_URI,
	'DB_URI:': process.env.DB_URI
});
mongoose
	.connect(`${process.env.MONGO_URI}`, {
		keepAlive          : true,
		useNewUrlParser    : true,
		useCreateIndex     : true,
		useFindAndModify   : false,
		useUnifiedTopology : true
	})
	.then(() => console.log('Database Connected Successfully'))
	.catch((err) => console.log('Database error: ' + err.message));

module.exports.User = require('./user');
module.exports.Room = require('./room');
