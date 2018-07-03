var mongoose = require('mongoose');
var admin_schema = new mongoose.Schema({ name: 'string', username: 'string', password : 'string'},{collection:'admin'});
module.exports = mongoose.model('admin', admin_schema);