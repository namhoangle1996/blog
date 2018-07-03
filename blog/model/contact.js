var mongoose = require('mongoose');
var contact_schema = new mongoose.Schema({ tieudelon: 'string', tieudenho: 'string', trangthai : 'string'},{collection:'index'});
module.exports = mongoose.model('contact', contact_schema);