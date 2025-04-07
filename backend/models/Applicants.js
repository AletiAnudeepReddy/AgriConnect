const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0, // Default rating until it's calculated or updated
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true,
    },
    laborerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Laborer",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Apply"
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
