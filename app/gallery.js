var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs'); 


var userSchema = mongoose.Schema({
	local: {
		id: Number,
		user: String,
		caption: String,
		url: String,
		cookies: Number,
		level: Number
	},
});
