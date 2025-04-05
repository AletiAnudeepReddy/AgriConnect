const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  title: { type: String, required: true }, // Example: "Farm Helper Needed"
  location: { type: String, required: true },
  date: { type: String, required: true }, // or Date if you want to format it later
  timings: { type: String, required: true }, // Example: "12 PM - 6 PM"
  wages: { type: Number, required: true },   // In INR
  workers_required: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Virtual ID for job
jobSchema.virtual('job_id').get(function () {
  return this._id.toHexString();
});

jobSchema.set('toJSON', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
