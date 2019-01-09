const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JavanSchema = new Schema({
   manufacturer_part_number: { type: String , unique : true },
   quantity_available: { type: Number },
   unit_price: { type: Number },
   productId: { type: Number },
   haveIt : {type: Boolean}
});

JavanSchema.statics.findByName = function (name) {
    let product = this;
    return product.findOne({
        'manufacturer_part_number': name,
    });
};

module.exports = mongoose.model('JavanModel', JavanSchema);