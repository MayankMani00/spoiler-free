const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose
	.connect(`${process.env.MONGO_URL}`, {
		keepAlive          : true,
		useNewUrlParser    : true,
		useCreateIndex     : true,
		useFindAndModify   : false,
		useUnifiedTopology : true
	})
	.then(() => console.log('Database Connected Successfully'))
	.catch((err) => console.log(err.message));

module.exports.User = require('./user');
module.exports.Room = require('./room');
