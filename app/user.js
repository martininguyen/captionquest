var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs'); 


var userSchema = mongoose.Schema({
	local: {
		password: String,
		email: String,
		pets: [{
			name: String,
			picture: String,
			description: String,
			price: Number,
			id: String,
			bought: Boolean,
			location: Number
		}],
		cookies: Number
	},
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.isEqual = function() {
	console.log(this);
	if (this == -1) return true;
	return false;
}
module.exports = mongoose.model('myuser', userSchema);
