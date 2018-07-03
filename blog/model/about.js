var mongoose = require('mongoose');
var about_schema = new mongoose.Schema({ noidung: 'string'},{collection:'about'});
module.exports = mongoose.model('about', about_schema);