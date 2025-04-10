const mongoose = require("mongoose");

const farmerRatingSchema = new mongoose.Schema({
    laborerId: { type: mongoose.Schema.Types.ObjectId, ref: "Laborer", required: true },
    laborerName: { type: String, required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FarmerRating", farmerRatingSchema);
