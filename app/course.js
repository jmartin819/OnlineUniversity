// grab the packages that we need for the Course model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Course schema
var courseSchema = new Schema({
	name: { type: String, required: true},
	category: {type: String, required: true},
	dateCreated: {type: String, required: true},
	description: {type: String}
});

// return the model
module.exports = mongoose.model('Course', courseSchema);
