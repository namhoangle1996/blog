var mongoose = require('mongoose');
var sample_post_schema = new mongoose.Schema({ tieudelon: 'string', tieudenho: 'string', trangthai : 'string'},{collection:'index'});
module.exports = mongoose.model('sample_post', sample_post_schema);