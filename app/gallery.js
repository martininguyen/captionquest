var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs'); 


var gallerySchema = mongoose.Schema({
	local: {
		path: String,
		user: String,
		caption: String,
		cookies: Number,
		level: Number
	},
});

module.exports = mongoose.model('Gallery', gallerySchema);