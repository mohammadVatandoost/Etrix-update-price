const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ICKalaSchema = new Schema({
   manufacturer_part_number: { type: String , unique : true },
   quantity_available: { type: String },
   unit_price: { type: String },
   haveIt : {type: Boolean}
});

ICKalaSchema.statics.findByName = function (name) {
    let product = this;
    return product.findOne({
        'manufacturer_part_number': name,
    });
};

module.exports = mongoose.model('ICKalaModel', ICKalaSchema);