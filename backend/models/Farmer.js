const mongoose = require('mongoose'); 
const farmerSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    farm_location: { type: String, required: true },
    farm_size: { type: String, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now }
});

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
