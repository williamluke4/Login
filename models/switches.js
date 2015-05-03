var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var switchSchema = new Schema({
    elementID : String,
    dataID  : String,
    group  : String
});


module.exports = mongoose.model( 'switches',switchSchema );
