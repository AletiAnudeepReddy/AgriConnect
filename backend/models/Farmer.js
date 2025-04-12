const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  farm_location: { type: String, required: true },
  farm_size: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

// Virtual field: farmer_id
farmerSchema.virtual('farmer_id').get(function () {
  return this._id.toHexString();
});

farmerSchema.set('toJSON', { virtuals: true });  // Make sure virtuals are included in JSON

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
