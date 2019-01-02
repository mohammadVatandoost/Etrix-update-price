const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
   id: { type: String },
   hd_image: { type: String },
   ld_image: { type: String },
   datasheet: { type: String },
   footprint: { type: String },
   manufacturer_part_number: { type: String },
   quantity_available: { type: String },
   unit_price: { type: String },
   manufacturer: { type: String },
   description: { type: String },
   packaging: { type: String},
   series: { type: String},
   part_status: { type: String },
   minimum_quantity: { type: String },
   original: { type: String },
   component_id: { type: String },
   part_id: { type: String },
   model: { type: String },
   created_at: { type: String },
   updated_at: { type: String },
});

ProductSchema.statics.findByName = function (name) {
    let User = this;
    return User.findOne({
        'manufacturer_part_number': name,
    });
};

module.exports = mongoose.model('ProductModel', ProductSchema);