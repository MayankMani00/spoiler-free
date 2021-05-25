const mongoose = require('mongoose');

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
	sentAt : {
		type     : String,
		required : true
	}
};

const RoomSchema = new mongoose.Schema({
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
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
