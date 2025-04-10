const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    laborerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laborer",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Rating", ratingSchema);
