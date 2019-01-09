const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NameConversionSchema = new Schema({
   id: { type: String },
   value: { type: String },
   name: { type: String },
   created_at: { type: String },
   updated_at: { type: String },
});


module.exports = mongoose.model('NameConversionModel', NameConversionSchema);