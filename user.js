const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Msg = {
	sentTo : {
		type     : String,
		required : true
	},
	sentBy : {
		type    : String,
		require : true
	},
	body   : {
		type     : String,
		required : true
	},
	sent   : {
		type     : Date,
		required : true
	}
};

const Room = {
	title    : {
		type     : String,
		required : true
	},
	id       : {
		type     : String,
		required : true
	},
	users    : [
		String
	],
	messages : [
		Msg
	]
};

const UserSchema = new mongoose.Schema({
	username : {
		type     : String,
		required : true
	},
	password : {
		type     : String,
		required : true
	},
	rooms    : [
		Room
	]
});

UserSchema.pre('save', async function(next) {
	try {
		if (!this.isModified('password')) {
			return next();
		}
		let hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		return next();
	} catch (err) {
		return next(err);
	}
});

UserSchema.methods.comparePassword = async function(candidatePassword, next) {
	try {
		let isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	} catch (err) {
		return next(err);
	}
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
