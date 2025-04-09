const mongoose = require("mongoose");

const AcceptedLaborerSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    laborerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laborer', required: true },
    laborerName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("AcceptedLaborer", AcceptedLaborerSchema);
