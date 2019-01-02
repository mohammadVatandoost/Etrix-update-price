const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICKalaSchema = new Schema({
   manufacturer_part_number: { type: String },
   quantity_available: { type: String },
   unit_price: { type: String },
});

// ProductSchema.statics.findByName = function (name) {
//     let User = this;
//     return User.findOne({
//         'manufacturer_part_number': name,
//     });
// };

module.exports = mongoose.model('ICKalaModel', ICKalaSchema);