var mongoose = require('mongoose');
var index_schema = new mongoose.Schema({ tieudelon: 'string', tieudenho: 'string', trangthai : 'string', link: 'string', theloai:'string'},{collection:'index'});
module.exports = mongoose.model('index', index_schema);