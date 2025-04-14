// models/acceptedFarmer.js
const mongoose = require('mongoose');

const acceptedFarmerSchema = new mongoose.Schema({
  farmerFullName: {
    type: String,
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Farmer',
  },
  laborerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Laborer',
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AcceptedFarmer', acceptedFarmerSchema);
