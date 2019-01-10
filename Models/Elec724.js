const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Elec724Schema = new Schema({
   manufacturer_part_number: { type: String , unique : true },
   quantity_available: { type: String },
   unit_price: { type: String },
   haveIt : {type: Boolean}
});


module.exports = mongoose.model('ICKalaModel', Elec724Schema);