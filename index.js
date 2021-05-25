const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('debug', true);
mongoose.Promise = Promise;
// console.log(process.env.MONGO_URL);
mongoose
	.connect(`${process.env.DB_URI}`, {
		keepAlive          : true,
		useNewUrlParser    : true,
		useCreateIndex     : true,
		useFindAndModify   : false,
		useUnifiedTopology : true
	})
	.then(() => console.log('Database Connected Successfully'))
	.catch((err) => console.log('Databse error: ' + err.message));

module.exports.User = require('./user');
module.exports.Room = require('./room');
